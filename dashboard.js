/**
 * Laboratorium Rekam Medis UDINUS Semarang
 * Logic & State Management for Inventory Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. STICKY HEADER EFFECT
    // ==========================================
    const header = document.getElementById('header');

    // Sticky Header Scroll Effect
    const handleScroll = () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ==========================================
    // 1. CONSTANTS & DATA KEYS
    // ==========================================
    const KEY_FORMULIR = 'labrm_master_formulir';
    const KEY_RAK = 'labrm_master_rak';
    const KEY_STOK = 'labrm_stok_bulanan';

    // Automatically reset LocalStorage if it contains the old structure/data
    const DB_VERSION_KEY = 'labrm_db_version';
    const CURRENT_DB_VERSION = 'v2_excel_data_v2';
    if (localStorage.getItem(DB_VERSION_KEY) !== CURRENT_DB_VERSION) {
        localStorage.removeItem(KEY_FORMULIR);
        localStorage.removeItem(KEY_RAK);
        localStorage.removeItem(KEY_STOK);
        localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    }

    // Mock/Default Data
    const DEFAULT_RAK = [
        { id: 'rak-1', kode: 'RAK-01', nama: 'Rak Filing Rawat Jalan (RJ)', lokasi: 'Ruang Filing Utama - Baris Depan' },
        { id: 'rak-2', kode: 'RAK-02', nama: 'Rak Filing Rawat Inap (RI)', lokasi: 'Ruang Filing Utama - Baris Belakang' },
        { id: 'rak-3', kode: 'RAK-03', nama: 'Rak Koding & Klasifikasi Medis', lokasi: 'Ruang Praktik Tengah - Rak A' },
        { id: 'rak-4', kode: 'RAK-04', nama: 'Rak Formulir Gawat Darurat (UGD)', lokasi: 'Konter Pendaftaran Depan' }
    ];

    const DEFAULT_FORMULIR = [
        { id: 'form-1', kode: 'RM-01', nama: 'Ringkasan Riwayat Poli', deskripsi: 'Ringkasan riwayat klinis pelayanan poliklinik rawat jalan.' },
        { id: 'form-2', kode: 'RM-02', nama: 'Catatan Poliklinik', deskripsi: 'Lembar pencatatan perkembangan klinis poliklinik.' },
        { id: 'form-3', kode: 'RM-03', nama: 'Pemeriksaan Fisik Umum', deskripsi: 'Formulir pencatatan hasil pemeriksaan fisik umum.' },
        { id: 'form-4', kode: 'RM-04', nama: 'Pemeriksaan Fisik Saraf', deskripsi: 'Lembar pemeriksaan sistem neurologis.' },
        { id: 'form-5', kode: 'RM-05', nama: 'Pemeriksaan Fisik THT', deskripsi: 'Formulir hasil pemeriksaan telinga, hidung, tenggorokan.' },
        { id: 'form-6', kode: 'RM-06', nama: 'Pemeriksaan Fisik Mata', deskripsi: 'Lembar pemeriksaan tajam penglihatan dan anatomi mata.' },
        { id: 'form-7', kode: 'RM-07', nama: 'Pemeriksaan Psikiatri', deskripsi: 'Pencatatan evaluasi kesehatan jiwa/psikiatrik.' },
        { id: 'form-8', kode: 'RM-08', nama: 'Kartu Obat', deskripsi: 'Daftar kendali rekonsiliasi dan pemberian obat.' },
        { id: 'form-9', kode: 'RM-09', nama: 'Hasil Laboratorium', deskripsi: 'Lembar khusus untuk menempelkan salinan hasil lab.' },
        { id: 'form-10', kode: 'RM-10', nama: 'Penempelan Salinan Resep', deskripsi: 'Arsip untuk menempelkan lembar salinan resep obat.' },
        { id: 'form-11', kode: 'RM-11', nama: 'Masuk Darurat', deskripsi: 'Lembar pemeriksaan triase dan pelayanan IGD.' },
        { id: 'form-12', kode: 'RM-12', nama: 'Identitas Pasien RI', deskripsi: 'Lembar pencatatan data sosial dan identitas rawat inap.' },
        { id: 'form-13', kode: 'RM-13', nama: 'Ringkasan Masuk dan Keluar', deskripsi: 'Lembar ringkasan masuk & keluar (lembar muka rawat inap).' },
        { id: 'form-14', kode: 'RM-14', nama: 'Surat Keterangan Kematian', deskripsi: 'Formulir pelaporan kematian resmi.' },
        { id: 'form-15', kode: 'RM-15', nama: 'Persetujuan Umum', deskripsi: 'Formulir persetujuan umum (general consent) tindakan non-invasif.' }
    ];

    const DEFAULT_STOK = [
        // Semester Genap Tahun Ajaran 2025/2026 (Juli 2026)
        { id: 'stok-1', bulan: '2026-07', formulirId: 'form-1', rakId: 'rak-1', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-2', bulan: '2026-07', formulirId: 'form-2', rakId: 'rak-1', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-3', bulan: '2026-07', formulirId: 'form-3', rakId: 'rak-2', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-4', bulan: '2026-07', formulirId: 'form-4', rakId: 'rak-2', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-5', bulan: '2026-07', formulirId: 'form-5', rakId: 'rak-3', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-6', bulan: '2026-07', formulirId: 'form-6', rakId: 'rak-3', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-7', bulan: '2026-07', formulirId: 'form-7', rakId: 'rak-3', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-8', bulan: '2026-07', formulirId: 'form-8', rakId: 'rak-1', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-9', bulan: '2026-07', formulirId: 'form-9', rakId: 'rak-1', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-10', bulan: '2026-07', formulirId: 'form-10', rakId: 'rak-1', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-11', bulan: '2026-07', formulirId: 'form-11', rakId: 'rak-4', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-12', bulan: '2026-07', formulirId: 'form-12', rakId: 'rak-2', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-13', bulan: '2026-07', formulirId: 'form-13', rakId: 'rak-2', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-14', bulan: '2026-07', formulirId: 'form-14', rakId: 'rak-2', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' },
        { id: 'stok-15', bulan: '2026-07', formulirId: 'form-15', rakId: 'rak-1', stokAwal: 20, masuk: 80, digunakan: 60, rusak: 0, keterangan: '' }
    ];

    // ==========================================
    // 2. STATE MANAGEMENT & GETTERS
    // ==========================================
    const getData = (key, defaultData) => {
        const stored = localStorage.getItem(key);
        if (!stored) {
            localStorage.setItem(key, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(stored);
    };

    const saveData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    let listFormulir = getData(KEY_FORMULIR, DEFAULT_FORMULIR);
    let listRak = getData(KEY_RAK, DEFAULT_RAK);
    let listStok = getData(KEY_STOK, DEFAULT_STOK);

    // ==========================================
    // 3. UI ELEMENT REFERENCES
    // ==========================================
    // Tabs Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Metrics Cards
    const countTotalFormulirEl = document.getElementById('count-total-formulir');
    const countTotalRakEl = document.getElementById('count-total-rak');
    const countTersediaEl = document.getElementById('count-tersedia');
    const countHabisEl = document.getElementById('count-habis');

    // Filter Controls
    const filterBulanSelect = document.getElementById('filter-bulan');
    const filterRakSelect = document.getElementById('filter-rak');
    const filterStatusSelect = document.getElementById('filter-status');
    const searchDokumenInput = document.getElementById('search-dokumen');

    // Tables
    const tableOverviewBody = document.getElementById('table-overview-body');
    const tableFormulirBody = document.getElementById('table-formulir-body');
    const tableRakBody = document.getElementById('table-rak-body');

    // Modals
    const modalFormulir = document.getElementById('modal-formulir');
    const modalRak = document.getElementById('modal-rak');
    const modalStok = document.getElementById('modal-stok');

    // Forms inside Modals
    const formFormulir = document.getElementById('form-formulir');
    const formRak = document.getElementById('form-rak');
    const formStok = document.getElementById('form-stok');

    // Add Buttons
    const btnAddFormulir = document.getElementById('btn-add-formulir');
    const btnAddRak = document.getElementById('btn-add-rak');
    const btnUpdateStok = document.getElementById('btn-update-stok');

    // Active Edit IDs
    let editFormulirId = null;
    let editRakId = null;

    // ==========================================
    // 4. GENERAL HELPER FUNCTIONS
    // ==========================================
    // Pre-populate Month filter with unique sorted months from data and calendar months
    const initializeMonthFilter = () => {
        const months = new Set();
        
        // Add existing months from data
        listStok.forEach(item => months.add(item.bulan));
        
        // Ensure current month is present
        const now = new Date();
        const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        months.add(currentYearMonth);
        
        // Sort months descending (newest first)
        const sortedMonths = Array.from(months).sort().reverse();
        
        // Clear filter options and re-add
        filterBulanSelect.innerHTML = '';
        sortedMonths.forEach(m => {
            const dateObj = new Date(m + '-01');
            const monthLabel = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
            
            const option = document.createElement('option');
            option.value = m;
            option.textContent = monthLabel;
            filterBulanSelect.appendChild(option);
        });

        // Set default month to newest available month (usually current month)
        if (sortedMonths.length > 0) {
            filterBulanSelect.value = sortedMonths[0];
        }
    };

    // Populate Rack Filter options
    const updateRackFiltersAndSelects = () => {
        // Dropdown filter di halaman utama
        filterRakSelect.innerHTML = '<option value="">Semua Rak</option>';
        listRak.forEach(rak => {
            const option = document.createElement('option');
            option.value = rak.id;
            option.textContent = `${rak.kode} - ${rak.nama}`;
            filterRakSelect.appendChild(option);
        });

        // Dropdown Rak di Modal Update Stok
        const stokRakSelect = document.getElementById('stok-rak-id');
        if (stokRakSelect) {
            stokRakSelect.innerHTML = '<option value="" disabled selected>-- Pilih Rak Penyimpanan --</option>';
            listRak.forEach(rak => {
                const option = document.createElement('option');
                option.value = rak.id;
                option.textContent = `${rak.kode} - ${rak.nama}`;
                stokRakSelect.appendChild(option);
            });
        }
    };

    // Populate Formulir Select in Modal Update Stok
    const updateFormulirSelects = () => {
        const stokFormulirSelect = document.getElementById('stok-formulir-id');
        if (stokFormulirSelect) {
            stokFormulirSelect.innerHTML = '<option value="" disabled selected>-- Pilih Formulir --</option>';
            listFormulir.forEach(form => {
                const option = document.createElement('option');
                option.value = form.id;
                option.textContent = `${form.kode} - ${form.nama}`;
                stokFormulirSelect.appendChild(option);
            });
        }
    };

    // ==========================================
    // 5. RENDERING LOGIC
    // ==========================================

    // TAB 1: OVERVIEW & STOCK TRACKING
    const renderOverview = () => {
        const selectedMonth = filterBulanSelect.value;
        const searchVal = searchDokumenInput.value.toLowerCase().trim();
        const selectedRak = filterRakSelect.value;
        const selectedStatus = filterStatusSelect.value;

        // Reset Table
        tableOverviewBody.innerHTML = '';

        let totalTersedia = 0;
        let totalHabis = 0;
        let totalBelumDiupdate = 0;
        let matchingRecordsCount = 0;

        // Loop through all master forms to build current month status
        listFormulir.forEach(form => {
            // Find stock record for this form and month
            const stockRecord = listStok.find(s => s.bulan === selectedMonth && s.formulirId === form.id);
            
            // Get rack details
            let rakName = '-';
            let rakCode = '';
            let stokAwal = 0;
            let masuk = 0;
            let digunakan = 0;
            let rusak = 0;
            let sisa = 0;
            let keterangan = '';
            let status = 'Belum Di-update'; // Default status if no record exists

            if (stockRecord) {
                stokAwal = stockRecord.stokAwal || 0;
                masuk = stockRecord.masuk || 0;
                digunakan = stockRecord.digunakan || 0;
                rusak = stockRecord.rusak || 0;
                sisa = stokAwal + masuk - digunakan - rusak;
                keterangan = stockRecord.keterangan || '';
                status = sisa > 0 ? 'Tersedia' : 'Habis';
                
                const rakObj = listRak.find(r => r.id === stockRecord.rakId);
                if (rakObj) {
                    rakName = rakObj.nama;
                    rakCode = rakObj.kode;
                }
            }

            // Calculate global statistics for selected month (before search filtering)
            if (status === 'Tersedia') totalTersedia++;
            else if (status === 'Habis') totalHabis++;
            else totalBelumDiupdate++;

            // Apply filters to table display
            const matchesSearch = form.kode.toLowerCase().includes(searchVal) || form.nama.toLowerCase().includes(searchVal);
            const matchesRak = !selectedRak || (stockRecord && stockRecord.rakId === selectedRak);
            const matchesStatus = !selectedStatus || 
                (selectedStatus === 'tersedia' && status === 'Tersedia') ||
                (selectedStatus === 'habis' && status === 'Habis') ||
                (selectedStatus === 'belum' && status === 'Belum Di-update');

            if (matchesSearch && matchesRak && matchesStatus) {
                matchingRecordsCount++;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${form.kode}</strong></td>
                    <td>
                        <div style="font-weight: 600; color: var(--color-primary-dark);">${form.nama}</div>
                        <small style="color: var(--color-text-muted); display: block; max-width: 320px; line-height: 1.3; margin-top: 4px;">${form.deskripsi}</small>
                    </td>
                    <td>${rakCode ? `<span class="badge" style="background-color: rgba(11,78,162,0.06); color: var(--color-primary-dark); font-weight:600;">${rakCode}</span> ${rakName}` : '-'}</td>
                    <td style="text-align: center;">${stockRecord ? stokAwal : '-'}</td>
                    <td style="text-align: center;">${stockRecord ? masuk : '-'}</td>
                    <td style="text-align: center;">${stockRecord ? digunakan : '-'}</td>
                    <td style="text-align: center;">${stockRecord ? rusak : '-'}</td>
                    <td style="text-align: center; font-weight: 700; font-size: 1.05rem; color: ${sisa > 0 ? 'var(--color-success)' : '#EF4444'};">${stockRecord ? sisa : '-'}</td>
                    <td style="font-size: 0.9rem; color: var(--color-text-muted);">${stockRecord ? keterangan : '-'}</td>
                    <td>
                        <div class="action-btn-group">
                            <button class="btn-icon edit" onclick="triggerUpdateStok('${form.id}', '${stockRecord ? stockRecord.rakId : ''}', ${stokAwal}, ${masuk}, ${digunakan}, ${rusak}, '${keterangan.replace(/'/g, "\\'")}')" title="Update Stok Bulanan">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </button>
                        </div>
                    </td>
                `;
                tableOverviewBody.appendChild(tr);
            }
        });

        // Show empty state if no rows matching search/filters
        if (matchingRecordsCount === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="10">
                    <div class="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                        <h4>Tidak ada data dokumen ditemukan</h4>
                        <p>Cobalah untuk membersihkan filter atau menambahkan data baru melalui panel master.</p>
                    </div>
                </td>
            `;
            tableOverviewBody.appendChild(tr);
        }

        // Update metric labels on cards
        countTotalFormulirEl.textContent = listFormulir.length;
        countTotalRakEl.textContent = listRak.length;
        countTersediaEl.textContent = totalTersedia;
        countHabisEl.textContent = totalHabis;
    };

    // TAB 2: MASTER FORMULIR
    const renderFormulirList = () => {
        tableFormulirBody.innerHTML = '';

        if (listFormulir.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="4">
                    <div class="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <h4>Belum ada Master Formulir</h4>
                        <p>Tambahkan master formulir praktikum manual terlebih dahulu.</p>
                    </div>
                </td>
            `;
            tableFormulirBody.appendChild(tr);
            return;
        }

        listFormulir.forEach(form => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${form.kode}</strong></td>
                <td style="font-weight: 600; color: var(--color-primary-dark);">${form.nama}</td>
                <td style="color: var(--color-text-muted); font-size: 0.9rem;">${form.deskripsi || '-'}</td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-icon edit" onclick="triggerEditFormulir('${form.id}')" title="Edit Formulir">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon delete" onclick="triggerDeleteFormulir('${form.id}')" title="Hapus Formulir">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </td>
            `;
            tableFormulirBody.appendChild(tr);
        });
    };

    // TAB 3: MASTER RAK
    const renderRakList = () => {
        tableRakBody.innerHTML = '';

        if (listRak.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="4">
                    <div class="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                        <h4>Belum ada Master Rak</h4>
                        <p>Tambahkan rak penyimpanan berkas rekam medis manual baru.</p>
                    </div>
                </td>
            `;
            tableRakBody.appendChild(tr);
            return;
        }

        listRak.forEach(rak => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="badge" style="background-color: rgba(11,78,162,0.08); color: var(--color-primary-dark);">${rak.kode}</span></td>
                <td style="font-weight: 600; color: var(--color-primary-dark);">${rak.nama}</td>
                <td style="color: var(--color-text-muted); font-size: 0.9rem;">${rak.lokasi || '-'}</td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-icon edit" onclick="triggerEditRak('${rak.id}')" title="Edit Rak">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon delete" onclick="triggerDeleteRak('${rak.id}')" title="Hapus Rak">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </td>
            `;
            tableRakBody.appendChild(tr);
        });
    };

    // Refresh all rendered elements
    const refreshUI = () => {
        renderOverview();
        renderFormulirList();
        renderRakList();
    };

    // ==========================================
    // 6. TAB NAVIGATION TRIGGER
    // ==========================================
    const switchTab = (targetTab) => {
        // Set active class on buttons
        tabButtons.forEach(b => {
            if (b.getAttribute('data-tab') === targetTab) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        // Set active tab content
        tabContents.forEach(content => {
            if (content.getAttribute('id') === `content-${targetTab}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Trigger specific tab render
        if (targetTab === 'overview') renderOverview();
        else if (targetTab === 'formulir') renderFormulirList();
        else if (targetTab === 'rak') renderRakList();
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Attach click listeners to footer tab links
    document.querySelectorAll('.footer-tab-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetTab = link.getAttribute('data-tab');
            if (targetTab) {
                e.preventDefault();
                switchTab(targetTab);
                
                // Smooth scroll to the dashboard section if clicked
                const dashboardSec = document.querySelector('.dashboard-section');
                if (dashboardSec) {
                    dashboardSec.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ==========================================
    // 7. MODALS CONTROLLERS (OPEN / CLOSE)
    // ==========================================
    const openModal = (modalElement) => {
        modalElement.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modalElement) => {
        modalElement.classList.remove('open');
        document.body.style.overflow = '';
    };

    // Attach close button listeners on all modals
    document.querySelectorAll('.modal-close, .btn-modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close modal on escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.open');
            if (activeModal) closeModal(activeModal);
        }
    });

    // ==========================================
    // 8. MASTER FORMULIR CRUD HANDLERS
    // ==========================================
    btnAddFormulir.addEventListener('click', () => {
        editFormulirId = null;
        formFormulir.reset();
        document.getElementById('modal-formulir-title').textContent = 'Tambah Master Formulir';
        openModal(modalFormulir);
    });

    formFormulir.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const kode = document.getElementById('form-kode').value.toUpperCase().trim();
        const nama = document.getElementById('form-nama').value.trim();
        const deskripsi = document.getElementById('form-deskripsi').value.trim();

        // Unique Validation (except when editing the same item)
        const isDuplicate = listFormulir.some(f => f.kode === kode && f.id !== editFormulirId);
        if (isDuplicate) {
            alert(`Kode Formulir "${kode}" sudah digunakan! Harap gunakan kode lain.`);
            return;
        }

        if (editFormulirId) {
            // Edit mode
            listFormulir = listFormulir.map(f => {
                if (f.id === editFormulirId) {
                    return { ...f, kode, nama, deskripsi };
                }
                return f;
            });
        } else {
            // Create mode
            const newForm = {
                id: 'form-' + Date.now(),
                kode,
                nama,
                deskripsi
            };
            listFormulir.push(newForm);
        }

        saveData(KEY_FORMULIR, listFormulir);
        closeModal(modalFormulir);
        refreshUI();
        updateFormulirSelects();
    });

    window.triggerEditFormulir = (id) => {
        const formObj = listFormulir.find(f => f.id === id);
        if (!formObj) return;

        editFormulirId = id;
        document.getElementById('form-kode').value = formObj.kode;
        document.getElementById('form-nama').value = formObj.nama;
        document.getElementById('form-deskripsi').value = formObj.deskripsi;

        document.getElementById('modal-formulir-title').textContent = 'Edit Master Formulir';
        openModal(modalFormulir);
    };

    window.triggerDeleteFormulir = (id) => {
        const formObj = listFormulir.find(f => f.id === id);
        if (!formObj) return;

        const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus master formulir "${formObj.kode} - ${formObj.nama}"?\nTindakan ini juga akan menghapus data riwayat stok bulanan formulir tersebut.`);
        if (confirmDelete) {
            // Delete Form
            listFormulir = listFormulir.filter(f => f.id !== id);
            saveData(KEY_FORMULIR, listFormulir);

            // Cascade delete stocks relating to this form
            listStok = listStok.filter(s => s.formulirId !== id);
            saveData(KEY_STOK, listStok);

            refreshUI();
            updateFormulirSelects();
        }
    };

    // ==========================================
    // 9. MASTER RAK CRUD HANDLERS
    // ==========================================
    btnAddRak.addEventListener('click', () => {
        editRakId = null;
        formRak.reset();
        document.getElementById('modal-rak-title').textContent = 'Tambah Master Rak';
        openModal(modalRak);
    });

    formRak.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const kode = document.getElementById('rak-kode').value.toUpperCase().trim();
        const nama = document.getElementById('rak-nama').value.trim();
        const lokasi = document.getElementById('rak-lokasi').value.trim();

        // Unique Validation (except when editing the same item)
        const isDuplicate = listRak.some(r => r.kode === kode && r.id !== editRakId);
        if (isDuplicate) {
            alert(`Kode Rak "${kode}" sudah digunakan! Harap gunakan kode lain.`);
            return;
        }

        if (editRakId) {
            // Edit mode
            listRak = listRak.map(r => {
                if (r.id === editRakId) {
                    return { ...r, kode, nama, lokasi };
                }
                return r;
            });
        } else {
            // Create mode
            const newRak = {
                id: 'rak-' + Date.now(),
                kode,
                nama,
                lokasi
            };
            listRak.push(newRak);
        }

        saveData(KEY_RAK, listRak);
        closeModal(modalRak);
        refreshUI();
        updateRackFiltersAndSelects();
    });

    window.triggerEditRak = (id) => {
        const rakObj = listRak.find(r => r.id === id);
        if (!rakObj) return;

        editRakId = id;
        document.getElementById('rak-kode').value = rakObj.kode;
        document.getElementById('rak-nama').value = rakObj.nama;
        document.getElementById('rak-lokasi').value = rakObj.lokasi;

        document.getElementById('modal-rak-title').textContent = 'Edit Master Rak';
        openModal(modalRak);
    };

    window.triggerDeleteRak = (id) => {
        const rakObj = listRak.find(r => r.id === id);
        if (!rakObj) return;

        const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus master rak "${rakObj.kode} - ${rakObj.nama}"?\nStok dokumen yang terikat dengan rak ini akan kehilangan rincian lokasi raknya.`);
        if (confirmDelete) {
            // Delete Rak
            listRak = listRak.filter(r => r.id !== id);
            saveData(KEY_RAK, listRak);

            // Update stocks where this rack was assigned: set rakId to empty
            listStok = listStok.map(s => {
                if (s.rakId === id) {
                    return { ...s, rakId: '' };
                }
                return s;
            });
            saveData(KEY_STOK, listStok);

            refreshUI();
            updateRackFiltersAndSelects();
        }
    };

    // ==========================================
    // 10. UPDATE STOK BULANAN HANDLERS
    // ==========================================
    // Triggered from button header "Update Stok Bulanan"
    btnUpdateStok.addEventListener('click', () => {
        formStok.reset();
        
        // Default the month in modal to current filter month
        document.getElementById('stok-bulan').value = filterBulanSelect.value;
        document.getElementById('stok-formulir-id').disabled = false;
        
        openModal(modalStok);
    });

    // Triggered directly from "Edit/Update" action on the document list
    window.triggerUpdateStok = (formulirId, rakId, stokAwal, masuk, digunakan, rusak, keterangan) => {
        formStok.reset();

        document.getElementById('stok-bulan').value = filterBulanSelect.value;
        
        // Select & lock the Form field
        const stokFormulirSelect = document.getElementById('stok-formulir-id');
        stokFormulirSelect.value = formulirId;
        stokFormulirSelect.disabled = false; // keep it enabled but preselected

        // Select other input fields
        if (rakId) {
            document.getElementById('stok-rak-id').value = rakId;
        }
        document.getElementById('stok-awal').value = stokAwal || 0;
        document.getElementById('stok-masuk').value = masuk || 0;
        document.getElementById('stok-digunakan').value = digunakan || 0;
        document.getElementById('stok-rusak').value = rusak || 0;
        document.getElementById('stok-keterangan').value = keterangan || '';

        openModal(modalStok);
    };

    formStok.addEventListener('submit', (e) => {
        e.preventDefault();

        const bulan = document.getElementById('stok-bulan').value;
        const formulirId = document.getElementById('stok-formulir-id').value;
        const rakId = document.getElementById('stok-rak-id').value;
        
        const stokAwal = parseInt(document.getElementById('stok-awal').value, 10) || 0;
        const masuk = parseInt(document.getElementById('stok-masuk').value, 10) || 0;
        const digunakan = parseInt(document.getElementById('stok-digunakan').value, 10) || 0;
        const rusak = parseInt(document.getElementById('stok-rusak').value, 10) || 0;
        const keterangan = document.getElementById('stok-keterangan').value.trim();

        if (!bulan || !formulirId || !rakId) {
            alert('Harap isi semua kolom wajib!');
            return;
        }

        // Check if stock entry already exists for this formulir and month
        const existingIndex = listStok.findIndex(s => s.bulan === bulan && s.formulirId === formulirId);

        if (existingIndex !== -1) {
            // Update existing record
            listStok[existingIndex].rakId = rakId;
            listStok[existingIndex].stokAwal = stokAwal;
            listStok[existingIndex].masuk = masuk;
            listStok[existingIndex].digunakan = digunakan;
            listStok[existingIndex].rusak = rusak;
            listStok[existingIndex].keterangan = keterangan;
        } else {
            // Insert new record
            const newStokRecord = {
                id: 'stok-' + Date.now(),
                bulan,
                formulirId,
                rakId,
                stokAwal,
                masuk,
                digunakan,
                rusak,
                keterangan
            };
            listStok.push(newStokRecord);
        }

        // Save and reload
        saveData(KEY_STOK, listStok);
        closeModal(modalStok);
        
        // Make sure the filter month is updated and synced
        initializeMonthFilter();
        // Keep selected month active
        filterBulanSelect.value = bulan;
        
        refreshUI();
    });

    // ==========================================
    // 11. FILTER EVENTS TRIGGER
    // ==========================================
    filterBulanSelect.addEventListener('change', renderOverview);
    filterRakSelect.addEventListener('change', renderOverview);
    filterStatusSelect.addEventListener('change', renderOverview);
    searchDokumenInput.addEventListener('input', renderOverview);

    // ==========================================
    // 12. INITIALIZATION
    // ==========================================
    initializeMonthFilter();
    updateRackFiltersAndSelects();
    updateFormulirSelects();
    refreshUI();
});
