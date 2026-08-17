import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { MapPinned, Sprout, Layers, FlaskConical, CalendarRange, Star, BadgeCheck, Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import StatTile from '@/components/ui/StatTile';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { useFarms } from '@/hooks/useFarms';
import { farmerProfile, soilInfo, previousSeasons, farmImages } from '@/data/dummyData';
import type { FarmRecord, FarmCreatePayload, FarmUpdatePayload } from '@/services/types';

const farmPhotoUrls = [
  'https://images.pexels.com/photos/19549654/pexels-photo-19549654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/5012854/pexels-photo-5012854.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/10672024/pexels-photo-10672024.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/19643774/pexels-photo-19643774.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const ratingColor: Record<string, string> = {
  A: 'bg-brand-100 text-brand-700',
  'A-': 'bg-brand-50 text-brand-600',
  'B+': 'bg-amber-50 text-amber-600',
  B: 'bg-amber-100 text-amber-700',
};

const emptyForm = {
  name: '',
  location: '',
  crop: '',
  area: '0',
  health: '85',
  status: 'Active',
  description: '',
  soil_type: '',
  village: '',
  district: '',
  irrigation_type: '',
  notes: '',
};

export default function FarmProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, loading, error, refetch, create, update, remove } = useFarms(user?.id);
  const farms = data ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<FarmRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formError, setFormError] = useState<string | null>(null);

  const totalAcreage = useMemo(() => farms.reduce((sum, farm) => sum + Number(farm.area || 0), 0), [farms]);
  const uniqueCrops = useMemo(() => Array.from(new Set(farms.map((farm) => farm.crop).filter(Boolean))).sort(), [farms]);
  const filteredFarms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return farms.filter((farm) => {
      const matchesQuery = !query || `${farm.name} ${farm.crop}`.toLowerCase().includes(query);
      const matchesCrop = cropFilter === 'All' || farm.crop === cropFilter;
      const matchesStatus = statusFilter === 'All' || farm.status === statusFilter;
      return matchesQuery && matchesCrop && matchesStatus;
    });
  }, [farms, cropFilter, search, statusFilter]);

  useEffect(() => {
    if (!user?.id) return;
    void refetch();
  }, [refetch, user?.id]);

  const openCreateModal = () => {
    setEditingFarm(null);
    setFormError(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (farm: FarmRecord) => {
    setEditingFarm(farm);
    setFormError(null);
    setForm({
      name: farm.name,
      location: farm.location,
      crop: farm.crop,
      area: String(farm.area),
      health: String(farm.health),
      status: farm.status,
      description: farm.description ?? '',
      soil_type: farm.soil_type ?? '',
      village: farm.village ?? '',
      district: farm.district ?? '',
      irrigation_type: farm.irrigation_type ?? '',
      notes: farm.notes ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

    const name = form.name.trim();
    const location = form.location.trim();
    const crop = form.crop.trim();
    const area = Number(form.area || 0);
    const health = Number(form.health || 0);
    const status = form.status.trim() || 'Active';

    if (!name || !location || !crop) {
      setFormError('Please fill in the farm name, location, and crop before saving.');
      return;
    }

    if (!Number.isFinite(area) || area <= 0) {
      setFormError('Area must be a positive number.');
      return;
    }

    if (!Number.isFinite(health) || health < 0 || health > 100) {
      setFormError('Health must be between 0 and 100.');
      return;
    }

    const payload = {
      owner_id: user.id,
      name,
      location,
      crop,
      area,
      health,
      status,
      description: form.description.trim() || undefined,
      soil_type: form.soil_type.trim() || undefined,
      village: form.village.trim() || undefined,
      district: form.district.trim() || undefined,
      irrigation_type: form.irrigation_type.trim() || undefined,
      notes: form.notes.trim() || undefined,
    } satisfies FarmCreatePayload;

    try {
      setFormError(null);
      if (editingFarm) {
        const updatePayload: FarmUpdatePayload = payload;
        await update.mutate({ id: editingFarm.id, payload: updatePayload });
        toast('Farm updated successfully', 'success');
      } else {
        await create.mutate(payload);
        toast('Farm added successfully', 'success');
      }

      setModalOpen(false);
      setEditingFarm(null);
      setForm(emptyForm);
      void refetch();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Unable to save farm', 'error');
    }
  };

  const handleDelete = async (farmId: string) => {
    if (!window.confirm('Delete this farm?')) return;
    try {
      await remove.mutate(farmId);
      toast('Farm deleted', 'success');
      void refetch();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Unable to delete farm', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <PageHeader icon={MapPinned} title="Farm Profile" subtitle="Complete overview of your land, soil, and crop history." />
        <Button variant="primary" size="sm" onClick={openCreateModal} className="gap-2">
          <Plus size={16} /> Add Farm
        </Button>
      </div>

      {/* Farmer info banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard padding="lg" className="bg-brand-700 text-white border-0 overflow-hidden relative">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-400/30" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="h-20 w-20 rounded-xl bg-white/10 grid place-items-center text-white font-display font-extrabold text-3xl shadow-card flex-shrink-0">
              {farmerProfile.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-2xl">{farmerProfile.name}</h2>
                {farmerProfile.verified && <BadgeCheck size={20} className="text-brand-300" />}
              </div>
              <div className="text-brand-100 mt-0.5">{farmerProfile.plan} · Member since {farmerProfile.memberSince}</div>
              <div className="flex items-center gap-1.5 text-brand-200 text-sm mt-1">
                <MapPinned size={14} /> {farmerProfile.location}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-display font-extrabold text-2xl">{farms.length}</div>
                <div className="text-[11px] text-brand-200 uppercase">Farms</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl">{totalAcreage.toFixed(1)}</div>
                <div className="text-[11px] text-brand-200 uppercase">Acres</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl flex items-center justify-center gap-1">
                  <Star size={16} className="text-amber-300 fill-amber-300" /> {farmerProfile.rating}
                </div>
                <div className="text-[11px] text-brand-200 uppercase">Rating</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Farm images gallery */}
      <div>
        <div className="font-display font-bold text-ink-900 mb-3">Farm Gallery</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {farmImages.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="group relative overflow-hidden rounded-2xl shadow-card">
              <img src={farmPhotoUrls[i]} alt={img.label} className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="font-bold text-sm">{img.label}</div>
                <div className="text-[11px] text-white/75">{img.caption}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Land details */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Layers} label="Total Land" value={`${totalAcreage.toFixed(1)} ac`} sub="under cultivation" accent="from-brand-500 to-brand-700" />
        <StatTile icon={Sprout} label="Active Farms" value={`${farms.filter((farm) => farm.status === 'Active').length}`} sub="currently active" accent="from-accent-500 to-accent-700" delay={0.06} />
        <StatTile icon={CalendarRange} label="Seasons Done" value={`${farmerProfile.seasonsCompleted}`} sub="completed seasons" accent="from-emerald-500 to-emerald-700" delay={0.12} />
        <StatTile icon={FlaskConical} label="Soil Tests" value={`${soilInfo.length}`} sub="fields tested" accent="from-amber-500 to-amber-600" delay={0.18} />
      </div>

      {/* Current crops */}
      <GlassCard padding="lg">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sprout size={18} className="text-brand-600" />
              <div className="font-display font-bold text-ink-900">Current Farms</div>
            </div>
            <div className="text-xs text-ink-600">{loading ? 'Loading…' : `${farms.length} farms`}</div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <FormField label="Search farms" name="search" value={search} onChange={setSearch} placeholder="Search by name or crop" />
            <FormField label="Crop filter" name="cropFilter" variant="select" value={cropFilter} onChange={setCropFilter} options={['All', ...uniqueCrops]} placeholder="All crops" />
            <FormField label="Status filter" name="statusFilter" variant="select" value={statusFilter} onChange={setStatusFilter} options={['All', 'Active', 'Planning', 'Idle', 'Harvested']} placeholder="All statuses" />
          </div>
        </div>
        {error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <CardSkeleton count={2} />
          </div>
        ) : filteredFarms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-ink-600">
            {farms.length === 0 ? (
              <div className="space-y-3">
                <div className="font-semibold text-ink-900">No farms added yet</div>
                <p>Add your first farm to start tracking land, crop, and health in one place.</p>
                <Button variant="primary" size="sm" onClick={openCreateModal}>Add your first farm</Button>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="font-semibold text-ink-900">No farms match your filters</div>
                <p>Try a different search term or reset the filters to see more farms.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredFarms.map((farm, i) => {
              const healthColor = farm.health >= 85 ? '#16a34a' : farm.health >= 75 ? '#f59e0b' : '#ef4444';
              return (
                <motion.div key={farm.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="rounded-2xl bg-brand-50 border border-gray-100 p-4 hover:border-brand-200 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl grid place-items-center bg-white/70">
                        <Sprout size={18} className="text-brand-600" />
                      </div>
                      <div>
                        <div className="font-bold text-ink-900">{farm.name}</div>
                        <div className="text-[11px] text-ink-600">{farm.crop} · {farm.area} ac</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: healthColor }}>{farm.health}%</div>
                      <div className="text-[10px] text-ink-600">health</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-ink-600">Location</span>
                    <span className="font-bold text-ink-900">{farm.location}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-ink-600">Status</span>
                    <span className="font-bold text-ink-900">{farm.status}</span>
                  </div>
                  {(farm.soil_type || farm.village || farm.district) && (
                    <div className="mt-2 text-[11px] text-ink-600">
                      {farm.soil_type ? `${farm.soil_type} soil` : 'Soil noted'}{farm.village ? ` · ${farm.village}` : ''}{farm.district ? ` · ${farm.district}` : ''}
                    </div>
                  )}
                  <div className="mt-3 h-1.5 rounded-full bg-ink-900/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${farm.health}%` }} transition={{ duration: 0.8, delay: i * 0.07 }} className="h-full rounded-full" style={{ background: healthColor }} />
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal(farm)} className="rounded-lg border border-gray-200 bg-white p-2 text-ink-700 hover:bg-gray-50" aria-label="Edit farm">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(farm.id)} className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 hover:bg-red-100" aria-label="Delete farm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Soil information */}
      <GlassCard padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={18} className="text-brand-600" />
          <div className="font-display font-bold text-ink-900">Soil Information</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-ink-600 border-b border-gray-100">
                <th className="pb-3 pr-4">Field</th>
                <th className="pb-3 pr-4">Soil Type</th>
                <th className="pb-3 pr-4">pH</th>
                <th className="pb-3 pr-4 hidden sm:table-cell">N (kg/ha)</th>
                <th className="pb-3 pr-4 hidden sm:table-cell">P (kg/ha)</th>
                <th className="pb-3 pr-4 hidden sm:table-cell">K (kg/ha)</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Organic C</th>
                <th className="pb-3 text-right">Tested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5">
              {soilInfo.map((s) => (
                <tr key={s.field} className="hover:bg-brand-50/40 transition-colors">
                  <td className="py-3 pr-4 font-bold text-ink-900">{s.field}</td>
                  <td className="py-3 pr-4"><span className="rounded-lg bg-brand-50 border border-brand-100 px-2 py-1 text-[11px] font-bold text-brand-700">{s.type}</span></td>
                  <td className="py-3 pr-4 font-bold text-ink-900">{s.pH}</td>
                  <td className="py-3 pr-4 text-ink-600 hidden sm:table-cell">{s.nitrogen}</td>
                  <td className="py-3 pr-4 text-ink-600 hidden sm:table-cell">{s.phosphorus}</td>
                  <td className="py-3 pr-4 text-ink-600 hidden sm:table-cell">{s.potassium}</td>
                  <td className="py-3 pr-4 text-ink-600 hidden md:table-cell">{s.organicCarbon}</td>
                  <td className="py-3 text-right text-ink-600 text-xs">{s.lastTested}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingFarm(null);
          setForm(emptyForm);
        }}
        title={editingFarm ? 'Edit Farm' : 'Add Farm'}
        subtitle="Keep your farm records aligned with the rest of your dashboard."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setModalOpen(false);
              setEditingFarm(null);
              setForm(emptyForm);
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={create.loading || update.loading || remove.loading}>
              {create.loading || update.loading ? 'Saving…' : editingFarm ? 'Save Changes' : 'Add Farm'}
            </Button>
          </>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Farm name" name="name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} placeholder="e.g. Green Valley Farm" required />
          <FormField label="Location" name="location" value={form.location} onChange={(value) => setForm((prev) => ({ ...prev, location: value }))} placeholder="Village / District" required />
          <FormField label="Primary crop" name="crop" value={form.crop} onChange={(value) => setForm((prev) => ({ ...prev, crop: value }))} placeholder="Paddy" required />
          <FormField label="Area (acres)" name="area" type="number" value={form.area} onChange={(value) => setForm((prev) => ({ ...prev, area: value }))} placeholder="5" required />
          <FormField label="Soil type" name="soil_type" value={form.soil_type} onChange={(value) => setForm((prev) => ({ ...prev, soil_type: value }))} placeholder="Loamy / Clay" />
          <FormField label="Village" name="village" value={form.village} onChange={(value) => setForm((prev) => ({ ...prev, village: value }))} placeholder="Village name" />
          <FormField label="District" name="district" value={form.district} onChange={(value) => setForm((prev) => ({ ...prev, district: value }))} placeholder="District" />
          <FormField label="Irrigation type" name="irrigation_type" value={form.irrigation_type} onChange={(value) => setForm((prev) => ({ ...prev, irrigation_type: value }))} placeholder="Drip / Canal" />
          <FormField label="Health (%)" name="health" type="number" value={form.health} onChange={(value) => setForm((prev) => ({ ...prev, health: value }))} placeholder="85" required />
          <FormField label="Status" name="status" variant="select" value={form.status} onChange={(value) => setForm((prev) => ({ ...prev, status: value }))} options={['Active', 'Planning', 'Idle', 'Harvested']} placeholder="Select status" required />
          <div className="sm:col-span-2">
            <FormField label="Description" name="description" variant="textarea" value={form.description} onChange={(value) => setForm((prev) => ({ ...prev, description: value }))} placeholder="Optional notes about the farm" />
          </div>
          <div className="sm:col-span-2">
            <FormField label="Notes" name="notes" variant="textarea" value={form.notes} onChange={(value) => setForm((prev) => ({ ...prev, notes: value }))} placeholder="Additional details for the farm record" />
          </div>
          {formError && <div className="sm:col-span-2 text-sm text-red-600">{formError}</div>}
        </div>
      </Modal>

      {/* Previous seasons */}
      <GlassCard padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <CalendarRange size={18} className="text-brand-600" />
          <div className="font-display font-bold text-ink-900">Previous Seasons</div>
        </div>
        <div className="space-y-3">
          {previousSeasons.map((s, i) => (
            <motion.div key={s.season} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="rounded-2xl bg-brand-50 border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-brand-200 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <span className={`inline-grid place-items-center h-10 w-10 rounded-2xl font-bold text-sm ${ratingColor[s.rating]}`}>{s.rating}</span>
                <div>
                  <div className="font-bold text-ink-900">{s.season}</div>
                  <div className="text-[11px] text-ink-600">{s.period} · {s.crop} · {s.area}</div>
                </div>
              </div>
              <div className="flex items-center gap-5 text-sm">
                <div className="text-center">
                  <div className="text-[10px] font-semibold uppercase text-ink-600">Yield</div>
                  <div className="font-bold text-ink-900">{s.yield}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-semibold uppercase text-ink-600">Revenue</div>
                  <div className="font-bold text-ink-900">₹{s.revenue.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-semibold uppercase text-ink-600">Profit</div>
                  <div className="font-bold text-brand-600">₹{s.profit.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
