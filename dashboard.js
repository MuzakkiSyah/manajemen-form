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
    const CURRENT_DB_VERSION = 'v4_link_dokumen';
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
        { id: 'form-1', kode: 'RM-01', nama: 'Ringkasan Riwayat Poli', deskripsi: 'Ringkasan riwayat klinis pelayanan poliklinik rawat jalan.', kategori: 'Rawat Jalan', link: 'https://docs.google.com/document/d/1_sample_link_rm01/edit?usp=sharing' },
        { id: 'form-2', kode: 'RM-02', nama: 'Catatan Poliklinik', deskripsi: 'Lembar pencatatan perkembangan klinis poliklinik.', kategori: 'Rawat Jalan', link: 'https://docs.google.com/document/d/1_sample_link_rm02/edit?usp=sharing' },
        { id: 'form-3', kode: 'RM-03', nama: 'Pemeriksaan Fisik Umum', deskripsi: 'Formulir pencatatan hasil pemeriksaan fisik umum.', kategori: 'Rawat Jalan', link: 'https://docs.google.com/document/d/1_sample_link_rm03/edit?usp=sharing' },
        { id: 'form-4', kode: 'RM-04', nama: 'Pemeriksaan Fisik Saraf', deskripsi: 'Lembar pemeriksaan sistem neurologis.', kategori: 'Rawat Jalan', link: 'https://docs.google.com/document/d/1_sample_link_rm04/edit?usp=sharing' },
        { id: 'form-5', kode: 'RM-05', nama: 'Pemeriksaan Fisik THT', deskripsi: 'Formulir hasil pemeriksaan telinga, hidung, tenggorokan.', kategori: 'Rawat Jalan', link: 'https://docs.google.com/document/d/1_sample_link_rm05/edit?usp=sharing' },
        { id: 'form-6', kode: 'RM-06', nama: 'Pemeriksaan Fisik Mata', deskripsi: 'Lembar pemeriksaan tajam penglihatan dan anatomi mata.', kategori: 'Rawat Jalan', link: 'https://docs.google.com/document/d/1_sample_link_rm06/edit?usp=sharing' },
        { id: 'form-7', kode: 'RM-07', nama: 'Pemeriksaan Psikiatri', deskripsi: 'Pencatatan evaluasi kesehatan jiwa/psikiatrik.', kategori: 'Rawat Jalan', link: '' },
        { id: 'form-8', kode: 'RM-08', nama: 'Kartu Obat', deskripsi: 'Daftar kendali rekonsiliasi dan pemberian obat.', kategori: 'Rawat Jalan', link: 'https://docs.google.com/document/d/1_sample_link_rm08/edit?usp=sharing' },
        { id: 'form-9', kode: 'RM-09', nama: 'Hasil Laboratorium', deskripsi: 'Lembar khusus untuk menempelkan salinan hasil lab.', kategori: 'Rawat Jalan', link: '' },
        { id: 'form-10', kode: 'RM-10', nama: 'Penempelan Salinan Resep', deskripsi: 'Arsip untuk menempelkan lembar salinan resep obat.', kategori: 'Rawat Jalan', link: '' },
        { id: 'form-11', kode: 'RM-11', nama: 'Masuk Darurat', deskripsi: 'Lembar pemeriksaan triase dan pelayanan IGD.', kategori: 'Rawat Jalan', link: 'https://docs.google.com/document/d/1_sample_link_rm11/edit?usp=sharing' },
        { id: 'form-12', kode: 'RM-12', nama: 'Identitas Pasien RI', deskripsi: 'Lembar pencatatan data sosial dan identitas rawat inap.', kategori: 'Rawat Inap', link: 'https://docs.google.com/document/d/1_sample_link_rm12/edit?usp=sharing' },
        { id: 'form-13', kode: 'RM-13', nama: 'Ringkasan Masuk dan Keluar', deskripsi: 'Lembar ringkasan masuk & keluar (lembar muka rawat inap).', kategori: 'Rawat Inap', link: 'https://docs.google.com/document/d/1_sample_link_rm13/edit?usp=sharing' },
        { id: 'form-14', kode: 'RM-14', nama: 'Surat Keterangan Kematian', deskripsi: 'Formulir pelaporan kematian resmi.', kategori: 'Rawat Inap', link: '' },
        { id: 'form-15', kode: 'RM-15', nama: 'Persetujuan Umum', deskripsi: 'Formulir persetujuan umum (general consent) tindakan non-invasif.', kategori: 'Rawat Inap', link: 'https://docs.google.com/document/d/1_sample_link_rm15/edit?usp=sharing' }
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

    // Pagination State
    let currentPageRj = 1;
    let currentPageRi = 1;
    let currentPageFormulir = 1;
    let currentPageRak = 1;
    const itemsPerPage = 10;

    // ==========================================
    // 3. UI ELEMENT REFERENCES
    // ==========================================
    // Tabs Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Metrics Cards
    const countTotalFormulirEl = document.getElementById('count-total-formulir');
    const countTotalRakEl = document.getElementById('count-total-rak');

    // Pagination Controls references
    const btnPrevRj = document.getElementById('btn-prev-rj');
    const btnNextRj = document.getElementById('btn-next-rj');
    const infoRj = document.getElementById('info-rj');

    const btnPrevRi = document.getElementById('btn-prev-ri');
    const btnNextRi = document.getElementById('btn-next-ri');
    const infoRi = document.getElementById('info-ri');

    const btnPrevFormulir = document.getElementById('btn-prev-formulir');
    const btnNextFormulir = document.getElementById('btn-next-formulir');
    const infoFormulir = document.getElementById('info-formulir');

    const btnPrevRak = document.getElementById('btn-prev-rak');
    const btnNextRak = document.getElementById('btn-next-rak');
    const infoRak = document.getElementById('info-rak');

    // Filter Controls - Rawat Jalan
    const filterBulanRjSelect = document.getElementById('filter-bulan-rj');
    const filterRakRjSelect = document.getElementById('filter-rak-rj');
    const filterStatusRjSelect = document.getElementById('filter-status-rj');
    const searchRjInput = document.getElementById('search-rj');

    // Filter Controls - Rawat Inap
    const filterBulanRiSelect = document.getElementById('filter-bulan-ri');
    const filterRakRiSelect = document.getElementById('filter-rak-ri');
    const filterStatusRiSelect = document.getElementById('filter-status-ri');
    const searchRiInput = document.getElementById('search-ri');

    // Tables
    const tableRjBody = document.getElementById('table-rj-body');
    const tableRiBody = document.getElementById('table-ri-body');
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
        
        // Clear filter options and re-add for both RJ and RI
        [filterBulanRjSelect, filterBulanRiSelect].forEach(selectEl => {
            if (!selectEl) return;
            selectEl.innerHTML = '';
            sortedMonths.forEach(m => {
                const dateObj = new Date(m + '-01');
                const monthLabel = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                
                const option = document.createElement('option');
                option.value = m;
                option.textContent = monthLabel;
                selectEl.appendChild(option);
            });

            // Set default month to newest available month (usually current month)
            if (sortedMonths.length > 0) {
                selectEl.value = sortedMonths[0];
            }
        });
    };

    // Populate Rack Filter options
    const updateRackFiltersAndSelects = () => {
        // Dropdown filter di halaman utama RJ dan RI
        [filterRakRjSelect, filterRakRiSelect].forEach(selectEl => {
            if (!selectEl) return;
            selectEl.innerHTML = '<option value="">Semua Rak</option>';
            listRak.forEach(rak => {
                const option = document.createElement('option');
                option.value = rak.id;
                option.textContent = `${rak.kode} - ${rak.nama}`;
                selectEl.appendChild(option);
            });
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

    // Helper to get active month
    const getActiveMonth = () => {
        const activeTabBtn = document.querySelector('.tab-btn.active');
        const activeTab = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'rawat-jalan';
        if (activeTab === 'rawat-inap' && filterBulanRiSelect) {
            return filterBulanRiSelect.value;
        }
        return filterBulanRjSelect ? filterBulanRjSelect.value : '';
    };

    // TAB 1a: RAWAT JALAN STOCK PANEL
    const renderRawatJalan = () => {
        if (!filterBulanRjSelect || !searchRjInput || !filterRakRjSelect || !filterStatusRjSelect || !tableRjBody) return;
        const selectedMonth = filterBulanRjSelect.value;
        const searchVal = searchRjInput.value.toLowerCase().trim();
        const selectedRak = filterRakRjSelect.value;
        const selectedStatus = filterStatusRjSelect.value;

        // Filter items
        const filteredFormulir = listFormulir.filter(form => {
            const formKat = form.kategori || 'Rawat Jalan';
            if (formKat !== 'Rawat Jalan') return false;

            const stockRecord = listStok.find(s => s.bulan === selectedMonth && s.formulirId === form.id);
            let status = 'Belum Di-update';
            if (stockRecord) {
                const sisa = (stockRecord.stokAwal || 0) + (stockRecord.masuk || 0) - (stockRecord.digunakan || 0) - (stockRecord.rusak || 0);
                status = sisa > 0 ? 'Tersedia' : 'Habis';
            }

            const matchesSearch = form.kode.toLowerCase().includes(searchVal) || form.nama.toLowerCase().includes(searchVal);
            const matchesRak = !selectedRak || (stockRecord && stockRecord.rakId === selectedRak);
            const matchesStatus = !selectedStatus || 
                (selectedStatus === 'tersedia' && status === 'Tersedia') ||
                (selectedStatus === 'habis' && status === 'Habis') ||
                (selectedStatus === 'belum' && status === 'Belum Di-update');

            return matchesSearch && matchesRak && matchesStatus;
        });

        // Pagination calculations
        const totalItems = filteredFormulir.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        if (currentPageRj > totalPages) currentPageRj = totalPages;

        if (btnPrevRj) btnPrevRj.disabled = currentPageRj <= 1;
        if (btnNextRj) btnNextRj.disabled = currentPageRj >= totalPages;
        if (infoRj) infoRj.textContent = `Halaman ${currentPageRj} dari ${totalPages}`;

        const paginatedFormulir = filteredFormulir.slice((currentPageRj - 1) * itemsPerPage, currentPageRj * itemsPerPage);

        tableRjBody.innerHTML = '';
        paginatedFormulir.forEach(form => {
            const stockRecord = listStok.find(s => s.bulan === selectedMonth && s.formulirId === form.id);
            
            let rakName = '-';
            let rakCode = '';
            let stokAwal = 0;
            let masuk = 0;
            let digunakan = 0;
            let rusak = 0;
            let sisa = 0;
            let keterangan = '';

            if (stockRecord) {
                stokAwal = stockRecord.stokAwal || 0;
                masuk = stockRecord.masuk || 0;
                digunakan = stockRecord.digunakan || 0;
                rusak = stockRecord.rusak || 0;
                sisa = stokAwal + masuk - digunakan - rusak;
                keterangan = stockRecord.keterangan || '';
                
                const rakObj = listRak.find(r => r.id === stockRecord.rakId);
                if (rakObj) {
                    rakName = rakObj.nama;
                    rakCode = rakObj.kode;
                }
            }

            const linkHtml = form.link ? `
                <a href="${form.link}" target="_blank" class="btn-link-dokumen" title="Buka Dokumen / Link Restock">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Link Dokumen
                </a>
            ` : '';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${form.kode}</strong></td>
                <td>
                    <div style="font-weight: 600; color: var(--color-primary-dark);">${form.nama}</div>
                    <small style="color: var(--color-text-muted); display: block; max-width: 320px; line-height: 1.3; margin-top: 4px;">${form.deskripsi}</small>
                    ${linkHtml}
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
                        ${stockRecord ? `
                            <button class="btn-icon delete" onclick="triggerDeleteStok('${stockRecord.id}')" title="Hapus Stok Bulan Ini">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;
            tableRjBody.appendChild(tr);
        });

        if (paginatedFormulir.length === 0) {
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
            tableRjBody.appendChild(tr);
        }
    };

    // TAB 1b: RAWAT INAP STOCK PANEL
    const renderRawatInap = () => {
        if (!filterBulanRiSelect || !searchRiInput || !filterRakRiSelect || !filterStatusRiSelect || !tableRiBody) return;
        const selectedMonth = filterBulanRiSelect.value;
        const searchVal = searchRiInput.value.toLowerCase().trim();
        const selectedRak = filterRakRiSelect.value;
        const selectedStatus = filterStatusRiSelect.value;

        // Filter items
        const filteredFormulir = listFormulir.filter(form => {
            const formKat = form.kategori || 'Rawat Jalan';
            if (formKat !== 'Rawat Inap') return false;

            const stockRecord = listStok.find(s => s.bulan === selectedMonth && s.formulirId === form.id);
            let status = 'Belum Di-update';
            if (stockRecord) {
                const sisa = (stockRecord.stokAwal || 0) + (stockRecord.masuk || 0) - (stockRecord.digunakan || 0) - (stockRecord.rusak || 0);
                status = sisa > 0 ? 'Tersedia' : 'Habis';
            }

            const matchesSearch = form.kode.toLowerCase().includes(searchVal) || form.nama.toLowerCase().includes(searchVal);
            const matchesRak = !selectedRak || (stockRecord && stockRecord.rakId === selectedRak);
            const matchesStatus = !selectedStatus || 
                (selectedStatus === 'tersedia' && status === 'Tersedia') ||
                (selectedStatus === 'habis' && status === 'Habis') ||
                (selectedStatus === 'belum' && status === 'Belum Di-update');

            return matchesSearch && matchesRak && matchesStatus;
        });

        // Pagination calculations
        const totalItems = filteredFormulir.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        if (currentPageRi > totalPages) currentPageRi = totalPages;

        if (btnPrevRi) btnPrevRi.disabled = currentPageRi <= 1;
        if (btnNextRi) btnNextRi.disabled = currentPageRi >= totalPages;
        if (infoRi) infoRi.textContent = `Halaman ${currentPageRi} dari ${totalPages}`;

        const paginatedFormulir = filteredFormulir.slice((currentPageRi - 1) * itemsPerPage, currentPageRi * itemsPerPage);

        tableRiBody.innerHTML = '';
        paginatedFormulir.forEach(form => {
            const stockRecord = listStok.find(s => s.bulan === selectedMonth && s.formulirId === form.id);
            
            let rakName = '-';
            let rakCode = '';
            let stokAwal = 0;
            let masuk = 0;
            let digunakan = 0;
            let rusak = 0;
            let sisa = 0;
            let keterangan = '';

            if (stockRecord) {
                stokAwal = stockRecord.stokAwal || 0;
                masuk = stockRecord.masuk || 0;
                digunakan = stockRecord.digunakan || 0;
                rusak = stockRecord.rusak || 0;
                sisa = stokAwal + masuk - digunakan - rusak;
                keterangan = stockRecord.keterangan || '';
                
                const rakObj = listRak.find(r => r.id === stockRecord.rakId);
                if (rakObj) {
                    rakName = rakObj.nama;
                    rakCode = rakObj.kode;
                }
            }

            const linkHtml = form.link ? `
                <a href="${form.link}" target="_blank" class="btn-link-dokumen" title="Buka Dokumen / Link Restock">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Link Dokumen
                </a>
            ` : '';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${form.kode}</strong></td>
                <td>
                    <div style="font-weight: 600; color: var(--color-primary-dark);">${form.nama}</div>
                    <small style="color: var(--color-text-muted); display: block; max-width: 320px; line-height: 1.3; margin-top: 4px;">${form.deskripsi}</small>
                    ${linkHtml}
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
                        ${stockRecord ? `
                            <button class="btn-icon delete" onclick="triggerDeleteStok('${stockRecord.id}')" title="Hapus Stok Bulan Ini">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;
            tableRiBody.appendChild(tr);
        });

        if (paginatedFormulir.length === 0) {
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
            tableRiBody.appendChild(tr);
        }
    };

    // Render Overview (Unified updates for stats and grids)
    const renderOverview = () => {
        renderRawatJalan();
        renderRawatInap();

        // Calculate specific stats for RJ based on RJ month selection
        const monthRj = filterBulanRjSelect ? filterBulanRjSelect.value : '';
        let tersediaRj = 0;
        let habisRj = 0;

        listFormulir.forEach(form => {
            const formKat = form.kategori || 'Rawat Jalan';
            if (formKat !== 'Rawat Jalan') return;
            const stockRecord = listStok.find(s => s.bulan === monthRj && s.formulirId === form.id);
            let sisa = 0;
            let status = 'Belum Di-update';

            if (stockRecord) {
                const stokAwal = stockRecord.stokAwal || 0;
                const masuk = stockRecord.masuk || 0;
                const digunakan = stockRecord.digunakan || 0;
                const rusak = stockRecord.rusak || 0;
                sisa = stokAwal + masuk - digunakan - rusak;
                status = sisa > 0 ? 'Tersedia' : 'Habis';
            }

            if (status === 'Tersedia') tersediaRj++;
            else {
                habisRj++;
            }
        });

        // Calculate specific stats for RI based on RI month selection
        const monthRi = filterBulanRiSelect ? filterBulanRiSelect.value : '';
        let tersediaRi = 0;
        let habisRi = 0;

        listFormulir.forEach(form => {
            const formKat = form.kategori || 'Rawat Jalan';
            if (formKat !== 'Rawat Inap') return;
            const stockRecord = listStok.find(s => s.bulan === monthRi && s.formulirId === form.id);
            let sisa = 0;
            let status = 'Belum Di-update';

            if (stockRecord) {
                const stokAwal = stockRecord.stokAwal || 0;
                const masuk = stockRecord.masuk || 0;
                const digunakan = stockRecord.digunakan || 0;
                const rusak = stockRecord.rusak || 0;
                sisa = stokAwal + masuk - digunakan - rusak;
                status = sisa > 0 ? 'Tersedia' : 'Habis';
            }

            if (status === 'Tersedia') tersediaRi++;
            else {
                habisRi++;
            }
        });

        // Update elements
        const countTersediaRjEl = document.getElementById('count-tersedia-rj');
        const countHabisRjEl = document.getElementById('count-habis-rj');
        const countTersediaRiEl = document.getElementById('count-tersedia-ri');
        const countHabisRiEl = document.getElementById('count-habis-ri');

        if (countTersediaRjEl) countTersediaRjEl.textContent = tersediaRj;
        if (countHabisRjEl) countHabisRjEl.textContent = habisRj;
        if (countTersediaRiEl) countTersediaRiEl.textContent = tersediaRi;
        if (countHabisRiEl) countHabisRiEl.textContent = habisRi;

        // Update master metrics
        if (countTotalFormulirEl) countTotalFormulirEl.textContent = listFormulir.length;
        if (countTotalRakEl) countTotalRakEl.textContent = listRak.length;
    };

    // TAB 2: MASTER FORMULIR
    const renderFormulirList = () => {
        tableFormulirBody.innerHTML = '';

        const totalItems = listFormulir.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        if (currentPageFormulir > totalPages) currentPageFormulir = totalPages;

        if (btnPrevFormulir) btnPrevFormulir.disabled = currentPageFormulir <= 1;
        if (btnNextFormulir) btnNextFormulir.disabled = currentPageFormulir >= totalPages;
        if (infoFormulir) infoFormulir.textContent = `Halaman ${currentPageFormulir} dari ${totalPages}`;

        if (listFormulir.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="5">
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

        const paginatedFormulir = listFormulir.slice((currentPageFormulir - 1) * itemsPerPage, currentPageFormulir * itemsPerPage);

        paginatedFormulir.forEach(form => {
            const linkHtml = form.link ? `
                <a href="${form.link}" target="_blank" class="btn-link-dokumen" title="Buka Dokumen / Link Restock">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Link Dokumen
                </a>
            ` : `
                <span style="font-size: 0.75rem; color: var(--color-text-muted); display: block; margin-top: 6px; font-style: italic;">Link belum diatur</span>
            `;

            const tr = document.createElement('tr');
            const katBadgeClass = form.kategori === 'Rawat Inap' ? 'badge-ri' : 'badge-rj';
            const katLabel = form.kategori || 'Rawat Jalan';
            tr.innerHTML = `
                <td><strong>${form.kode}</strong></td>
                <td>
                    <div style="font-weight: 600; color: var(--color-primary-dark);">${form.nama}</div>
                    ${linkHtml}
                </td>
                <td><span class="badge ${katBadgeClass}">${katLabel}</span></td>
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

        const totalItems = listRak.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        if (currentPageRak > totalPages) currentPageRak = totalPages;

        if (btnPrevRak) btnPrevRak.disabled = currentPageRak <= 1;
        if (btnNextRak) btnNextRak.disabled = currentPageRak >= totalPages;
        if (infoRak) infoRak.textContent = `Halaman ${currentPageRak} dari ${totalPages}`;

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

        const paginatedRak = listRak.slice((currentPageRak - 1) * itemsPerPage, currentPageRak * itemsPerPage);

        paginatedRak.forEach(rak => {
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

        // Sync header navigation links active state
        document.querySelectorAll('.header-tab-link').forEach(hl => {
            if (hl.getAttribute('data-tab') === targetTab) {
                hl.classList.add('active-link');
            } else {
                hl.classList.remove('active-link');
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
        if (targetTab === 'rawat-jalan' || targetTab === 'rawat-inap') renderOverview();
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

    // Attach click listeners to header tab links
    document.querySelectorAll('.header-tab-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetTab = link.getAttribute('data-tab');
            if (targetTab) {
                e.preventDefault();
                switchTab(targetTab);
                
                // Close mobile menu if open
                const menuToggle = document.getElementById('menu-toggle');
                const navMenu = document.querySelector('.nav-menu');
                if (menuToggle && navMenu) {
                    menuToggle.classList.remove('open');
                    navMenu.classList.remove('open');
                }

                // Smooth scroll to the dashboard section if clicked
                const dashboardSec = document.querySelector('.dashboard-section');
                if (dashboardSec) {
                    dashboardSec.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

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
        const link = document.getElementById('form-link').value.trim();

        // Unique Validation (except when editing the same item)
        const isDuplicate = listFormulir.some(f => f.kode === kode && f.id !== editFormulirId);
        if (isDuplicate) {
            alert(`Kode Formulir "${kode}" sudah digunakan! Harap gunakan kode lain.`);
            return;
        }

        const kategori = document.getElementById('form-kategori').value;

        if (editFormulirId) {
            // Edit mode
            listFormulir = listFormulir.map(f => {
                if (f.id === editFormulirId) {
                    return { ...f, kode, nama, deskripsi, kategori, link };
                }
                return f;
            });
        } else {
            // Create mode
            const newForm = {
                id: 'form-' + Date.now(),
                kode,
                nama,
                deskripsi,
                kategori,
                link
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
        document.getElementById('form-kategori').value = formObj.kategori || 'Rawat Jalan';
        document.getElementById('form-link').value = formObj.link || '';

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
        document.getElementById('stok-bulan').value = getActiveMonth();
        document.getElementById('stok-formulir-id').disabled = false;
        
        openModal(modalStok);
    });

    // Triggered directly from "Edit/Update" action on the document list
    window.triggerUpdateStok = (formulirId, rakId, stokAwal, masuk, digunakan, rusak, keterangan) => {
        formStok.reset();

        document.getElementById('stok-bulan').value = getActiveMonth();
        
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

    window.triggerDeleteStok = (id) => {
        const stokRecord = listStok.find(s => s.id === id);
        if (!stokRecord) return;

        const formObj = listFormulir.find(f => f.id === stokRecord.formulirId);
        const formLabel = formObj ? `${formObj.kode} - ${formObj.nama}` : '';

        const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus data stok untuk formulir "${formLabel}" pada bulan ini?\nData sisa stok akan kembali ke status 'Belum Di-update'.`);
        if (confirmDelete) {
            listStok = listStok.filter(s => s.id !== id);
            saveData(KEY_STOK, listStok);
            refreshUI();
        }
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
        // Sync selected month to both inputs
        if (filterBulanRjSelect) filterBulanRjSelect.value = bulan;
        if (filterBulanRiSelect) filterBulanRiSelect.value = bulan;
        
        refreshUI();
    });

    // ==========================================
    // 11. FILTER EVENTS TRIGGER
    // ==========================================
    // Sync month selections and render (resets pages)
    if (filterBulanRjSelect && filterBulanRiSelect) {
        filterBulanRjSelect.addEventListener('change', () => {
            filterBulanRiSelect.value = filterBulanRjSelect.value;
            currentPageRj = 1;
            currentPageRi = 1;
            renderOverview();
        });
        filterBulanRiSelect.addEventListener('change', () => {
            filterBulanRjSelect.value = filterBulanRiSelect.value;
            currentPageRj = 1;
            currentPageRi = 1;
            renderOverview();
        });
    }

    if (filterRakRjSelect) filterRakRjSelect.addEventListener('change', () => { currentPageRj = 1; renderOverview(); });
    if (filterStatusRjSelect) filterStatusRjSelect.addEventListener('change', () => { currentPageRj = 1; renderOverview(); });
    if (searchRjInput) searchRjInput.addEventListener('input', () => { currentPageRj = 1; renderOverview(); });

    if (filterRakRiSelect) filterRakRiSelect.addEventListener('change', () => { currentPageRi = 1; renderOverview(); });
    if (filterStatusRiSelect) filterStatusRiSelect.addEventListener('change', () => { currentPageRi = 1; renderOverview(); });
    if (searchRiInput) searchRiInput.addEventListener('input', () => { currentPageRi = 1; renderOverview(); });

    // Pagination Listeners Binding
    if (btnPrevRj && btnNextRj) {
        btnPrevRj.addEventListener('click', () => {
            if (currentPageRj > 1) {
                currentPageRj--;
                renderRawatJalan();
            }
        });
        btnNextRj.addEventListener('click', () => {
            currentPageRj++;
            renderRawatJalan();
        });
    }

    if (btnPrevRi && btnNextRi) {
        btnPrevRi.addEventListener('click', () => {
            if (currentPageRi > 1) {
                currentPageRi--;
                renderRawatInap();
            }
        });
        btnNextRi.addEventListener('click', () => {
            currentPageRi++;
            renderRawatInap();
        });
    }

    if (btnPrevFormulir && btnNextFormulir) {
        btnPrevFormulir.addEventListener('click', () => {
            if (currentPageFormulir > 1) {
                currentPageFormulir--;
                renderFormulirList();
            }
        });
        btnNextFormulir.addEventListener('click', () => {
            currentPageFormulir++;
            renderFormulirList();
        });
    }

    if (btnPrevRak && btnNextRak) {
        btnPrevRak.addEventListener('click', () => {
            if (currentPageRak > 1) {
                currentPageRak--;
                renderRakList();
            }
        });
        btnNextRak.addEventListener('click', () => {
            currentPageRak++;
            renderRakList();
        });
    }

    // ==========================================
    // 12. INITIALIZATION
    // ==========================================
    initializeMonthFilter();
    updateRackFiltersAndSelects();
    updateFormulirSelects();
    refreshUI();
});
