import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

const EMPTY = { brand_name: "", contact_email: "", target_url: "", placement_side: "both", status: "pending", amount_paid: "" };

export default function AddAdvertiserDialog({ onSaved }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageUrl, setImageUrl] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => { setForm(EMPTY); setImageUrl(""); setError(null); };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(res.file_url);
    } catch (err) {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    if (!form.brand_name || !form.contact_email) {
      setError("Brand name and contact email are required.");
      return;
    }
    setSaving(true);
    try {
      await base44.functions.invoke("addAdvertiser", {
        ...form,
        ad_image_url: imageUrl,
        amount_paid: form.amount_paid ? Number(form.amount_paid) : 0,
      });
      setOpen(false);
      reset();
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save advertiser.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-[#3B82F6]/40 text-[#3B82F6] text-xs font-bold">
          <Plus className="h-3 w-3" /> Add Advertiser
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#1D4ED8]">Add Advertiser</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[#1D4ED8] font-bold">Brand Name</Label>
            <Input value={form.brand_name} onChange={(e) => update("brand_name", e.target.value)} placeholder="e.g. Acme Ltd" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#1D4ED8] font-bold">Contact Email</Label>
            <Input type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} placeholder="contact@acme.com" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#1D4ED8] font-bold">Target URL</Label>
            <Input value={form.target_url} onChange={(e) => update("target_url", e.target.value)} placeholder="https://acme.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[#1D4ED8] font-bold">Placement</Label>
              <Select value={form.placement_side} onValueChange={(v) => update("placement_side", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#1D4ED8] font-bold">Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#1D4ED8] font-bold">Amount Paid ($)</Label>
            <Input type="number" value={form.amount_paid} onChange={(e) => update("amount_paid", e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#1D4ED8] font-bold">Brand Image</Label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-[#3B82F6]/40 px-3 py-2 text-xs font-bold text-[#3B82F6]">
                <Upload className="h-3 w-3" /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
              {uploading && <Loader2 className="h-4 w-4 animate-spin text-[#3B82F6]" />}
              {imageUrl && <span className="text-xs font-bold text-[#1D4ED8]">Image ready</span>}
            </div>
          </div>
          {error && <p className="text-xs font-bold text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="text-xs font-bold">Cancel</Button>
          <Button onClick={handleSave} disabled={saving || uploading} className="bg-[#FFD700] text-black text-xs font-bold hover:bg-[#FFD700]/90">
            {saving ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
            {saving ? "Saving…" : "Save Advertiser"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}