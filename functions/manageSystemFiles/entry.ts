import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// --- PII guardrails (inlined; backend functions can't import local files) ---
const PII_EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PII_CARD = /\b(?:\d[ -]*?){13,16}\b/g;
const PII_NIN = /^\d{11}$/;
const PROFANITY = /\b(fuck|shit|bitch|asshole|nigger|cunt|dick|piss)\b/gi;

function detectPII(text) {
  const findings = [];
  if (!text) return findings;
  const str = String(text);
  if (PII_EMAIL.test(str)) findings.push("email");
  PII_EMAIL.lastIndex = 0;
  if (PII_CARD.test(str)) findings.push("credit_card");
  PII_CARD.lastIndex = 0;
  if (PII_NIN.test(str.replace(/\D/g, ""))) findings.push("national_id");
  if (PROFANITY.test(str)) findings.push("profanity");
  PROFANITY.lastIndex = 0;
  return findings;
}

async function computeChecksum(text) {
  const data = new TextEncoder().encode(text || "");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    // --- SAVE (autosave + version sync + PII guardrails + integrity) ---
    if (action === 'save') {
      const { file_name, file_path, content, file_type, file_id } = body;
      if (!file_name || !file_path) return Response.json({ error: 'file_name and file_path required' }, { status: 400 });

      const pii = detectPII(content || "");
      if (pii.length > 0) {
        await base44.asServiceRole.entities.ActivityLog.create({
          user_id: user.id, action: 'pii_blocked', entity_type: 'SystemFile',
          details: `Blocked save to ${file_path}: ${pii.join(", ")}`, severity: 'warning'
        });
        return Response.json({ error: `Content blocked — PII detected: ${pii.join(", ")}` }, { status: 400 });
      }

      const checksum = await computeChecksum(content || "");
      const size_bytes = new TextEncoder().encode(content || "").length;

      if (file_id) {
        const existing = await base44.asServiceRole.entities.SystemFile.get(file_id);
        if (!existing) return Response.json({ error: 'File not found' }, { status: 404 });
        const updated = await base44.asServiceRole.entities.SystemFile.update(file_id, {
          content: content || "", checksum, size_bytes,
          version: (existing.version || 1) + 1,
          last_saved_by: user.id,
          file_name: file_name || existing.file_name,
          file_type: file_type || existing.file_type
        });
        await base44.asServiceRole.entities.ActivityLog.create({
          user_id: user.id, action: 'file_autosaved', entity_type: 'SystemFile', entity_id: file_id,
          details: `v${updated.version} · ${size_bytes}B`, severity: 'info'
        });
        return Response.json({ file: updated });
      }

      const created = await base44.asServiceRole.entities.SystemFile.create({
        file_name, file_path, content: content || "", file_type: file_type || "document",
        version: 1, checksum, size_bytes, last_saved_by: user.id, is_locked: false, is_deleted: false
      });
      await base44.asServiceRole.entities.ActivityLog.create({
        user_id: user.id, action: 'file_created', entity_type: 'SystemFile', entity_id: created.id,
        details: file_path, severity: 'info'
      });
      return Response.json({ file: created });
    }

    // --- RETRIEVE ---
    if (action === 'retrieve') {
      const { file_id, file_path } = body;
      let file;
      if (file_id) file = await base44.asServiceRole.entities.SystemFile.get(file_id);
      else if (file_path) {
        const files = await base44.asServiceRole.entities.SystemFile.filter({ file_path, is_deleted: false }, '-version', 1);
        file = files[0];
      }
      if (!file) return Response.json({ error: 'File not found' }, { status: 404 });
      return Response.json({ file });
    }

    // --- LIST (retrievable file system) ---
    if (action === 'list') {
      const files = await base44.asServiceRole.entities.SystemFile.filter({ is_deleted: false }, '-updated_date', 200);
      return Response.json({ files });
    }

    // --- DELETE (soft) ---
    if (action === 'delete') {
      const { file_id } = body;
      await base44.asServiceRole.entities.SystemFile.update(file_id, { is_deleted: true });
      await base44.asServiceRole.entities.ActivityLog.create({
        user_id: user.id, action: 'file_deleted', entity_type: 'SystemFile', entity_id: file_id,
        details: 'Soft deleted', severity: 'warning'
      });
      return Response.json({ success: true });
    }

    // --- INTEGRITY CHECK ---
    if (action === 'integrity_check') {
      const files = await base44.asServiceRole.entities.SystemFile.filter({ is_deleted: false });
      const results = [];
      let mismatches = 0;
      for (const f of files) {
        const computed = await computeChecksum(f.content || "");
        const match = computed === f.checksum;
        if (!match) mismatches++;
        results.push({ id: f.id, file_name: f.file_name, file_path: f.file_path, version: f.version, integrity: match ? "verified" : "mismatch" });
      }
      await base44.asServiceRole.entities.ActivityLog.create({
        user_id: user.id, action: 'integrity_check', entity_type: 'SystemFile',
        details: `${files.length} files checked, ${mismatches} mismatches`, severity: mismatches > 0 ? 'warning' : 'info'
      });
      return Response.json({ total: files.length, verified: files.length - mismatches, mismatches, results });
    }

    return Response.json({ error: 'Unknown action. Use: save, retrieve, list, delete, integrity_check' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});