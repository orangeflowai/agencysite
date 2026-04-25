import re

with open("payload-admin/src/components/BookingCalendar.tsx", "r") as f:
    content = f.read()

# Replace InventoryTab
old_inventory_tab = re.search(r"function InventoryTab\(\{.*?\n// ─── BookingsTab", content, re.DOTALL)

new_inventory_tab = """function InventoryTab({ tourId, tourSlug, tenant, date, slots, currentMonth, inventoryByDate, onSlotsChange, onRefreshMonth }: InventoryTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ availableSlots: number; totalSlots: number; priceOverride?: number }>({ availableSlots: 0, totalSlots: 0 });
  const [editError, setEditError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ time: '', availableSlots: 20, totalSlots: 20, priceOverride: '' });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [apiError, setApiError] = useState('');

  const sortedSlots = [...slots].sort((a, b) => a.time.localeCompare(b.time));

  async function handleSaveEdit(slot: InventorySlot) {
    const err = validateSlotInput(editValues.availableSlots, editValues.totalSlots);
    if (err) { setEditError(err); return; }
    setEditError('');
    const updated = await updateInventorySlot(slot.id, {
      availableSlots: editValues.availableSlots,
      totalSlots: editValues.totalSlots,
      ...(editValues.priceOverride !== undefined && { priceOverride: editValues.priceOverride }),
    });
    if (!updated) { setApiError('Failed to update slot. Please try again.'); return; }
    setApiError('');
    onSlotsChange(slots.map(s => s.id === slot.id ? { ...s, ...editValues } : s));
    setEditingId(null);
  }

  async function handleDelete(slot: InventorySlot) {
    setDeletingId(slot.id);
    const ok = await deleteInventorySlot(slot.id);
    setDeletingId(null);
    if (!ok) { setApiError('Failed to delete slot.'); return; }
    setApiError('');
    onSlotsChange(slots.filter(s => s.id !== slot.id));
  }

  async function handleAdd() {
    const err = validateSlotInput(addForm.availableSlots, addForm.totalSlots);
    if (err) { setAddError(err); return; }
    if (!addForm.time) { setAddError('Time is required'); return; }
    setAddError('');
    setAddLoading(true);
    const created = await createInventorySlot({
      tourId,
      date,
      time: addForm.time,
      availableSlots: addForm.availableSlots,
      totalSlots: addForm.totalSlots,
      tenant,
      priceOverride: addForm.priceOverride ? Number(addForm.priceOverride) : undefined,
    });
    setAddLoading(false);
    if (!created) { setAddError('Failed to create slot. Time may already exist.'); return; }
    onSlotsChange([...slots, created]);
    setAddForm({ time: '', availableSlots: 20, totalSlots: 20, priceOverride: '' });
  }

  return (
    <div className="space-y-4">
      {apiError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-medium">
          <AlertCircle size={14} />
          {apiError}
          <button onClick={() => setApiError('')} className="ml-auto"><X size={12} /></button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex gap-2">
        <button 
          onClick={() => setShowBulk(!showBulk)}
          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-2 ${
            showBulk ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900'
          }`}
        >
          <Calendar size={14} /> {showBulk ? 'Close Bulk Manager' : 'Bulk Slot Manager'}
        </button>
      </div>

      {showBulk ? (
        <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center"><Plus size={16}/></div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest">Rule-Based Generation</p>
              <p className="text-[10px] text-slate-400 font-medium">Create slots for entire seasons</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Start Date</label>
              <input type="date" className="w-full bg-slate-800 border-none rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">End Date</label>
              <input type="date" className="w-full bg-slate-800 border-none rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Select Days</label>
            <div className="flex gap-1">
              {['M','T','W','T','F','S','S'].map((d,i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-slate-800 text-[10px] font-black hover:bg-blue-600 transition-all">{d}</button>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-blue-900/50">
            Generate Slots (Rule Engine)
          </button>
        </div>
      ) : (
        <>
          {/* Quick Add Form */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
              <Plus size={14} /> Quick Add Slot
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <input
                type="text" placeholder="Time (09:00)"
                value={addForm.time}
                onChange={e => setAddForm(v => ({ ...v, time: e.target.value }))}
                className="px-3 py-2 bg-white border border-blue-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number" placeholder="Capacity"
                value={addForm.totalSlots}
                onChange={e => setAddForm(v => ({ ...v, totalSlots: Number(e.target.value), availableSlots: Number(e.target.value) }))}
                className="px-3 py-2 bg-white border border-blue-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAdd}
                disabled={addLoading}
                className="bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-40 flex items-center justify-center gap-1"
              >
                {addLoading ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
              </button>
            </div>
            {addError && <p className="text-[10px] text-red-500 font-bold">{addError}</p>}
          </div>

          {/* Existing Slots */}
          <div className="space-y-2">
            {sortedSlots.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No slots configured for this date</div>
            ) : (
              sortedSlots.map(slot => (
                <div key={slot.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all">
                  {editingId === slot.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                        <Clock size={14} className="text-blue-500" />
                        {slot.time}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Available</label>
                          <input
                            type="number" min={0} max={editValues.totalSlots}
                            value={editValues.availableSlots}
                            onChange={e => setEditValues(v => ({ ...v, availableSlots: Number(e.target.value) }))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Total</label>
                          <input
                            type="number" min={1}
                            value={editValues.totalSlots}
                            onChange={e => setEditValues(v => ({ ...v, totalSlots: Number(e.target.value) }))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveEdit(slot)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-1">
                          <Check size={12} /> Save
                        </button>
                        <button onClick={() => { setEditingId(null); setEditError(''); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Clock size={14} />
                          </div>
                          <p className="text-sm font-black text-slate-900">{slot.time}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Available</p>
                            <p className={`text-lg font-black leading-none ${slot.availableSlots === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                              {slot.availableSlots}<span className="text-slate-300 text-xs font-medium">/{slot.totalSlots}</span>
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => { setEditingId(slot.id); setEditValues({ availableSlots: slot.availableSlots, totalSlots: slot.totalSlots, priceOverride: slot.priceOverride }); setEditError(''); }}
                              className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(slot)}
                              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                            >
                              {deletingId === slot.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Resource Badges */}
                      <div className="flex gap-2">
                        <div className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guide</span>
                          <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">+ Assign</button>
                        </div>
                        <div className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vehicle</span>
                          <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">+ Assign</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── BookingsTab"""

if old_inventory_tab:
    content = content.replace(old_inventory_tab.group(0), new_inventory_tab)
    with open("payload-admin/src/components/BookingCalendar.tsx", "w") as f:
        f.write(content)
    print("Successfully patched InventoryTab!")
else:
    print("Failed to find InventoryTab")
