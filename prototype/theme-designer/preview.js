/* Live preview: sample screens built from wt-* components. All content is sample data. */
(function (global) {
  'use strict';

  const I = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
    ok: '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4 12 14l-3-3"/>',
    bad: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  };
  const ic = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
  global.WT_ICON = ic;

  const MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const DAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  const fmtBE = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
  const nf = (n) => n.toLocaleString('th-TH');

  // Thai national ID: check digit = (11 - Σ d_i·(14-i) mod 11) mod 10
  function idCheck(d12) {
    let s = 0;
    for (let i = 0; i < 12; i++) s += Number(d12[i]) * (13 - i);
    return (11 - (s % 11)) % 10;
  }
  const validId = (d) => /^\d{13}$/.test(d) && idCheck(d.slice(0, 12)) === Number(d[12]);
  const fmtId = (d) => [d.slice(0, 1), d.slice(1, 5), d.slice(5, 10), d.slice(10, 12), d.slice(12, 13)].filter(Boolean).join('-');
  const SAMPLE_ID = '110370234567' + idCheck('110370234567');

  const PLANS = ['วิทยาศาสตร์-คณิตศาสตร์', 'ภาษาอังกฤษ-คณิตศาสตร์', 'ภาษาไทย-สังคมศึกษา', 'ภาษาจีน'];
  const STATUS = [['ยืนยันสิทธิ์', 'success'], ['รอตรวจเอกสาร', 'warn'], ['เอกสารไม่ผ่าน', 'danger'], ['ส่งใบสมัครแล้ว', 'info']];
  const NAMES = ['กัญญาณัฐ ศรีสุข', 'ธนกร วงศ์ไทย', 'ปุณยวีร์ แก้วมณี', 'ภูริณัฐ ทองดี', 'ชนิดาภา อินทร์แก้ว', 'ณัฐวุฒิ พรหมมา',
    'พิมพ์ชนก รุ่งเรือง', 'กิตติพัศ ใจดี', 'อรปรียา สุวรรณ', 'ศุภกร บุญมา', 'นภัสสร มีสุข', 'ธีรภัทร แสงทอง', 'วรินทร์ธร ชัยมงคล', 'ปภาวิน เพชรรัตน์'];
  const ROWS = NAMES.map((n, i) => ({
    no: `M${i % 3 === 0 ? 4 : 1}-2569-${String(i + 1).padStart(4, '0')}`,
    name: (i % 2 ? 'ด.ช. ' : 'ด.ญ. ') + n,
    grade: i % 3 === 0 ? 'ม.4' : 'ม.1',
    plan: i % 3 === 0 ? PLANS[i % 4] : 'ห้องเรียนทั่วไป',
    score: 52 + ((i * 37) % 47) + ((i * 13) % 10) / 10,
    status: STATUS[(i * 7) % 4],
  }));
  const BARS = [[38, 22], [44, 30], [29, 18], [61, 35], [57, 41], [33, 20], [26, 15], [72, 48], [68, 39], [54, 37], [49, 31], [80, 52], [91, 60], [86, 55]];

  const st = {
    tab: 'dashboard', grade: 'ม.1', plan: PLANS[0], birth: new Date(2013, 2, 12), calView: new Date(2013, 2, 1),
    id: SAMPLE_ID, page: 1, q: '', sel: new Set([1]), open: null, busy: false,
  };

  // ---------- tabs ----------
  function dashboard() {
    const stats = [
      ['ผู้สมัครทั้งหมด', 1284, '+86 วันนี้', 'success'], ['ยืนยันสิทธิ์แล้ว', 932, '72.6%', 'info'],
      ['รอตรวจเอกสาร', 147, '12 รายเกิน 3 วัน', 'warn'], ['เอกสารไม่ผ่าน', 38, 'แจ้งผู้สมัครแล้ว 31', 'danger'],
    ];
    const max = 160;
    return `
      <div class="pv-head">
        <div><p class="wt-muted">ภาพรวม · ปีการศึกษา 2569</p><h2>ระบบรับสมัครนักเรียน</h2></div>
        <div class="pv-row"><span class="wt-icon-field">${ic('search')}<input id="pv-dash-search" class="wt-input" placeholder="ค้นหาผู้สมัคร"></span>
        <button class="wt-btn" data-action="toast">${ic('download')}ส่งออกรายงาน</button></div>
      </div>
      <div class="pv-grid4">${stats.map(([l, v, d, s]) => `
        <div class="wt-card wt-stat"><span class="wt-muted">${l}</span><span class="value">${nf(v)}</span><span class="wt-tag ${s}" style="align-self:flex-start">${d}</span></div>`).join('')}
      </div>
      <div class="pv-split">
        <div class="wt-card">
          <div class="wt-card-head"><span class="wt-card-title">ผู้สมัครรายวัน · 1–14 มีนาคม 2569</span>
            <div class="wt-legend"><span>ม.1</span><span class="b">ม.4</span></div></div>
          <div class="wt-bars">${BARS.map(([a, b]) => `<div title="ม.1 ${a} · ม.4 ${b}"><i class="a" style="height:${(a / max) * 160}px"></i><i class="b" style="height:${(b / max) * 160}px"></i></div>`).join('')}</div>
          <div class="wt-bar-axis">${BARS.map((_, i) => `<span>${i + 1}</span>`).join('')}</div>
        </div>
        <div class="wt-card">
          <div class="wt-card-head"><span class="wt-card-title">สมัครล่าสุด</span><button class="wt-btn text sm" data-goto="table">ดูทั้งหมด</button></div>
          ${ROWS.slice(0, 5).map((r) => `
            <div class="pv-person"><span class="wt-avatar">${r.name.split(' ')[1].slice(0, 1)}</span>
              <div class="pv-grow"><b>${r.name}</b><div class="wt-muted pv-small">${r.grade} · ${r.plan}</div></div>
              <span class="wt-tag ${r.status[1]}">${r.status[0]}</span></div>`).join('<hr class="wt-divider">')}
        </div>
      </div>`;
  }

  function select(id, value, options) {
    const open = st.open === id;
    return `<div class="wt-select">
      <button type="button" class="wt-select-btn" id="pv-${id}" data-action="toggle" data-key="${id}" aria-expanded="${open}"><span>${value}</span>${ic('down')}</button>
      ${open ? `<div class="wt-panel" role="listbox">${options.map((o) => `<div class="wt-option ${o === value ? 'selected' : ''}" role="option" data-action="pick" data-key="${id}" data-val="${o}">${o}${o === value ? ic('check') : ''}</div>`).join('')}</div>` : ''}
    </div>`;
  }

  function calendar() {
    const v = st.calView, y = v.getFullYear(), m = v.getMonth();
    const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < first; i++) cells += '<i></i>';
    for (let d = 1; d <= days; d++) {
      const sel = st.birth.getFullYear() === y && st.birth.getMonth() === m && st.birth.getDate() === d;
      cells += `<button type="button" class="${sel ? 'sel' : ''}" data-action="day" data-d="${d}">${d}</button>`;
    }
    return `<div class="wt-panel wt-cal">
      <div class="wt-cal-head"><button type="button" class="wt-btn text secondary icon-only sm" data-action="cal" data-dir="-1" aria-label="เดือนก่อน">${ic('left')}</button>
      <span>${MONTHS[m]} พ.ศ. ${y + 543}</span>
      <button type="button" class="wt-btn text secondary icon-only sm" data-action="cal" data-dir="1" aria-label="เดือนถัดไป">${ic('right')}</button></div>
      <div class="wt-cal-grid">${DAYS.map((d) => `<span>${d}</span>`).join('')}${cells}</div></div>`;
  }

  function form() {
    const idOk = validId(st.id);
    return `
      <div class="pv-head"><div><p class="wt-muted">ขั้นตอนที่ 2 จาก 4</p><h2>กรอกข้อมูลผู้สมัคร</h2></div><span class="wt-tag warn">ฉบับร่าง</span></div>
      <div class="wt-progress"><i style="width:50%"></i></div>
      <div class="wt-msg info">${ic('info')}<div>ตรวจเลขประจำตัวประชาชนและวันเกิดให้ตรงกับทะเบียนบ้านก่อนส่งใบสมัคร ระบบจะใช้ข้อมูลนี้ออกบัตรประจำตัวผู้สอบ</div></div>
      <form class="wt-card pv-form" id="pv-form" novalidate>
        <div class="pv-grid2">
          <label class="wt-field"><span class="wt-label">ชื่อ</span><input id="pv-fname" class="wt-input" value="กัญญาณัฐ"></label>
          <label class="wt-field"><span class="wt-label">นามสกุล</span><input id="pv-lname" class="wt-input" value="ศรีสุข"></label>
          <label class="wt-field"><span class="wt-label">เลขประจำตัวประชาชน</span>
            <input id="pv-cid" class="wt-input ${idOk ? '' : 'invalid'}" inputmode="numeric" value="${fmtId(st.id)}" data-action="cid">
            <span class="wt-help ${idOk ? '' : 'error'}" id="pv-cid-help">${idOk ? 'เลขถูกต้อง (ตรวจหลักสุดท้ายแล้ว)' : 'เลขไม่ถูกต้อง ตรวจอีกครั้ง'}</span></label>
          <div class="wt-field"><span class="wt-label">วันเกิด (พ.ศ.)</span>
            <div class="wt-select"><button type="button" class="wt-select-btn" id="pv-birth" data-action="toggle" data-key="birth"><span>${fmtBE(st.birth)}</span>${ic('cal')}</button>
            ${st.open === 'birth' ? calendar() : ''}</div>
            <span class="wt-help">ค่าใน model ยังเป็น Date (ค.ศ.) ปกติ</span></div>
          <div class="wt-field"><span class="wt-label">ระดับชั้นที่สมัคร</span>${select('grade', st.grade, ['ม.1', 'ม.4'])}</div>
          <label class="wt-field"><span class="wt-label">เบอร์โทรผู้ปกครอง</span><input id="pv-phone" class="wt-input" value="081-234-5678" inputmode="tel"></label>
        </div>
        <fieldset class="pv-fieldset"><legend class="wt-label">แผนการเรียน</legend>
          <div class="pv-row wrap">${PLANS.map((p, i) => `<label class="wt-check"><input type="radio" name="pv-plan" id="pv-plan-${i}" data-action="plan" value="${p}" ${p === st.plan ? 'checked' : ''}>${p}</label>`).join('')}</div>
        </fieldset>
        <label class="wt-field"><span class="wt-label">ที่อยู่ตามทะเบียนบ้าน</span><textarea id="pv-addr" class="wt-textarea">99/1 หมู่ 4 ตำบลบางรัก อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000</textarea></label>
        <div class="pv-row wrap">
          <label class="wt-check"><input type="checkbox" id="pv-agree" checked>ยืนยันว่าข้อมูลถูกต้องตามทะเบียนบ้าน</label>
          <label class="wt-check wt-switch"><input type="checkbox" id="pv-line">รับแจ้งผลทาง LINE</label>
        </div>
        <hr class="wt-divider">
        <div class="pv-row end wrap">
          <button type="button" class="wt-btn text secondary">ยกเลิก</button>
          <button type="button" class="wt-btn outlined" data-action="toast">บันทึกฉบับร่าง</button>
          <button type="submit" class="wt-btn" id="pv-submit" ${st.busy ? 'disabled' : ''}>${st.busy ? '<span class="wt-spin"></span>กำลังส่ง…' : ic('send') + 'ส่งใบสมัคร'}</button>
        </div>
      </form>`;
  }

  function table() {
    const per = 6, q = st.q.trim();
    const rows = ROWS.filter((r) => !q || (r.name + r.no + r.plan).includes(q));
    const pages = Math.max(1, Math.ceil(rows.length / per));
    if (st.page > pages) st.page = pages;
    const view = rows.slice((st.page - 1) * per, st.page * per);
    return `
      <div class="pv-head"><div><p class="wt-muted">รายชื่อผู้สมัคร</p><h2>ผู้สมัคร ${nf(rows.length)} คน</h2></div>
        <div class="pv-row wrap"><span class="wt-icon-field">${ic('search')}<input id="pv-q" class="wt-input" placeholder="ชื่อ, เลขที่สมัคร, แผน" value="${q}" data-action="search"></span>
        <button class="wt-btn outlined" data-action="toast">${ic('download')}ส่งออก Excel</button></div></div>
      ${st.sel.size ? `<div class="wt-msg info pv-selbar">${ic('info')}<div class="pv-grow">เลือกไว้ ${st.sel.size} รายการ</div><button class="wt-btn sm" data-action="toast">ยืนยันสิทธิ์</button><button class="wt-btn sm danger outlined" data-action="alert">ลบ</button></div>` : ''}
      <div class="wt-table-wrap"><table class="wt-table">
        <thead><tr><th style="width:1%"></th><th>เลขที่สมัคร</th><th>ชื่อ-นามสกุล</th><th>ชั้น</th><th>แผนการเรียน</th><th class="num">คะแนนสอบ</th><th>สถานะ</th></tr></thead>
        <tbody>${view.map((r) => {
          const idx = ROWS.indexOf(r), on = st.sel.has(idx);
          return `<tr class="${on ? 'sel' : ''}"><td><label class="wt-check"><input type="checkbox" id="pv-row-${idx}" data-action="row" data-i="${idx}" ${on ? 'checked' : ''} aria-label="เลือก ${r.name}"></label></td>
          <td>${r.no}</td><td>${r.name}</td><td>${r.grade}</td><td>${r.plan}</td><td class="num">${r.score.toFixed(1)}</td><td><span class="wt-tag ${r.status[1]}">${r.status[0]}</span></td></tr>`;
        }).join('') || '<tr><td colspan="7" class="wt-muted" style="text-align:center">ไม่พบผู้สมัครที่ตรงกับคำค้น</td></tr>'}</tbody>
      </table></div>
      <div class="wt-paginator"><span class="wt-muted">หน้า ${st.page} จาก ${pages}</span>
        <div class="wt-pages">${Array.from({ length: pages }, (_, i) => `<button class="wt-page ${i + 1 === st.page ? 'active' : ''}" data-action="page" data-p="${i + 1}">${i + 1}</button>`).join('')}</div></div>`;
  }

  function overlay() {
    return `
      <div class="pv-head"><div><p class="wt-muted">Dialog, Alert, Toast, Tooltip</p><h2>Overlay</h2></div></div>
      <div class="pv-grid2">
        <div class="wt-card"><span class="wt-card-title">Dialog</span><p class="wt-muted">ใช้ WtDialogService.open() แล้วรอผลเป็น Promise</p>
          <div class="pv-row"><button class="wt-btn" data-action="dialog">เปิด Dialog</button></div></div>
        <div class="wt-card"><span class="wt-card-title">Alert (แทน SweetAlert2)</span><p class="wt-muted">await alert.confirm({ severity: 'danger' })</p>
          <div class="pv-row"><button class="wt-btn danger" data-action="alert">${ic('trash')}ลบใบสมัคร</button></div></div>
        <div class="wt-card"><span class="wt-card-title">Toast</span><p class="wt-muted">มีแถบเวลาและปุ่ม action ได้</p>
          <div class="pv-row"><button class="wt-btn success" data-action="toast">${ic('ok')}แสดง Toast</button></div></div>
        <div class="wt-card"><span class="wt-card-title">Tooltip</span><p class="wt-muted">ชี้หรือ focus ที่ปุ่ม</p>
          <div class="pv-row"><span class="wt-tip" data-tip="แจ้งเตือน 3 รายการ"><button class="wt-btn secondary icon-only" aria-label="แจ้งเตือน">${ic('bell')}</button></span>
          <span class="wt-tip" data-tip="บันทึกเป็นฉบับร่าง"><button class="wt-btn outlined">บันทึก</button></span></div></div>
      </div>`;
  }

  function gallery() {
    const sev = [['', 'หลัก'], ['secondary', 'รอง'], ['success', 'สำเร็จ'], ['info', 'ข้อมูล'], ['warn', 'เตือน'], ['danger', 'อันตราย'], ['help', 'ช่วยเหลือ']];
    return `
      <div class="pv-head"><div><p class="wt-muted">ทุก Component ในธีมนี้</p><h2>Component gallery</h2></div></div>
      <div class="wt-card"><span class="wt-card-title">Button</span>
        <div class="pv-row wrap">${sev.map(([c, l]) => `<button class="wt-btn ${c}">${l}</button>`).join('')}</div>
        <div class="pv-row wrap">${sev.slice(0, 4).map(([c, l]) => `<button class="wt-btn outlined ${c}">${l}</button>`).join('')}${sev.slice(0, 3).map(([c, l]) => `<button class="wt-btn text ${c}">${l}</button>`).join('')}</div>
        <div class="pv-row wrap"><button class="wt-btn sm">เล็ก</button><button class="wt-btn">ปกติ</button><button class="wt-btn lg">ใหญ่</button>
          <button class="wt-btn rounded">${ic('plus')}เพิ่มผู้สมัคร</button><button class="wt-btn icon-only" aria-label="ค้นหา">${ic('search')}</button>
          <button class="wt-btn" disabled><span class="wt-spin"></span>กำลังบันทึก</button><button class="wt-btn" disabled>ปิดใช้งาน</button></div></div>
      <div class="pv-grid2">
        <div class="wt-card"><span class="wt-card-title">Input</span>
          <input id="pv-g1" class="wt-input" placeholder="พิมพ์ข้อความ ภาษาไทย ปู่ ปี้ ญี่ ฎีกา">
          <input id="pv-g2" class="wt-input invalid" value="0812">
          <span class="wt-help error">เบอร์โทรต้องมี 10 หลัก</span>
          <input id="pv-g3" class="wt-input" value="ปิดใช้งาน" disabled></div>
        <div class="wt-card"><span class="wt-card-title">Checkbox · Radio · Switch</span>
          <label class="wt-check"><input type="checkbox" id="pv-g4" checked>มีพี่น้องเรียนอยู่ในโรงเรียน</label>
          <label class="wt-check"><input type="checkbox" id="pv-g5">ต้องการรถรับส่ง</label>
          <label class="wt-check"><input type="radio" name="pv-g6" id="pv-g6a" checked>ภาคเรียนที่ 1</label>
          <label class="wt-check"><input type="radio" name="pv-g6" id="pv-g6b">ภาคเรียนที่ 2</label>
          <label class="wt-check wt-switch"><input type="checkbox" id="pv-g7" checked>เปิดรับสมัคร</label></div>
        <div class="wt-card"><span class="wt-card-title">Tag · Badge · Avatar</span>
          <div class="pv-row wrap"><span class="wt-tag">ม.1</span><span class="wt-tag success">ยืนยันสิทธิ์</span><span class="wt-tag info">ส่งแล้ว</span><span class="wt-tag warn">รอตรวจ</span><span class="wt-tag danger">ไม่ผ่าน</span><span class="wt-tag secondary">ฉบับร่าง</span></div>
          <div class="pv-row wrap"><span class="wt-avatar">ก</span><span class="wt-avatar sq">ธน</span><span class="wt-badge">8</span><span class="wt-badge danger">99+</span></div></div>
        <div class="wt-card"><span class="wt-card-title">Progress · Spinner · Skeleton</span>
          <div class="wt-progress"><i style="width:72%"></i></div>
          <div class="pv-row"><span class="wt-spin"></span><div class="pv-grow"><div class="wt-skel" style="width:70%"></div><div class="wt-skel" style="width:45%;margin-top:8px"></div></div></div></div>
      </div>
      <div class="wt-card"><span class="wt-card-title">Tabs · Accordion</span>
        <div class="wt-tabs" role="tablist">${['ข้อมูลผู้สมัคร', 'ผู้ปกครอง', 'เอกสาร', 'ผลสอบ'].map((t, i) => `<button class="wt-tab ${i === 0 ? 'active' : ''}" data-action="gtab">${t}</button>`).join('')}</div>
        <div class="wt-acc"><details open><summary>ต้องใช้เอกสารอะไรบ้าง</summary><div>สำเนาทะเบียนบ้าน สำเนาสูติบัตร และรูปถ่ายหน้าตรง 1 นิ้ว</div></details>
          <details><summary>ประกาศผลวันไหน</summary><div>ประกาศผลวันที่ 28 มีนาคม 2569 เวลา 09:00 น.</div></details></div></div>
      <div class="wt-card"><span class="wt-card-title">Message</span>
        <div class="wt-msg success">${ic('ok')}<div>ส่งใบสมัครเรียบร้อย เลขที่สมัคร M1-2569-0001</div></div>
        <div class="wt-msg warn">${ic('warn')}<div>ยังไม่ได้อัปโหลดสำเนาทะเบียนบ้าน</div></div>
        <div class="wt-msg danger">${ic('bad')}<div>เลขประจำตัวประชาชนนี้สมัครไปแล้ว</div></div></div>`;
  }

  const TABS = { dashboard, form, table, overlay, gallery };

  // ---------- overlays ----------
  let overlayEl = null;
  function toast(title, text) {
    const host = overlayEl.querySelector('.wt-toasts') || overlayEl.appendChild(Object.assign(document.createElement('div'), { className: 'wt-toasts' }));
    const t = document.createElement('div');
    t.className = 'wt-toast';
    t.setAttribute('role', 'status');
    t.innerHTML = `${ic('ok')}<div><b>${title}</b><span class="wt-muted">${text}</span></div><span class="bar"></span>`;
    host.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }
  function modal(html) {
    const m = document.createElement('div');
    m.className = 'wt-mask';
    m.innerHTML = html;
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) m.remove(); });
    overlayEl.appendChild(m);
    const f = m.querySelector('button:last-of-type');
    if (f) f.focus();
  }
  function dialog() {
    modal(`<div class="wt-dialog" role="dialog" aria-modal="true" aria-labelledby="pv-dlg-t">
      <div class="wt-dialog-head"><h3 id="pv-dlg-t">นัดหมายสอบสัมภาษณ์</h3><button class="wt-btn text secondary icon-only sm" data-close aria-label="ปิด">${ic('x')}</button></div>
      <div class="wt-dialog-body">ผู้สมัคร ด.ญ. กัญญาณัฐ ศรีสุข สอบสัมภาษณ์วันเสาร์ที่ 21 มีนาคม 2569 เวลา 09:30 น. ห้อง 312 อาคาร 3</div>
      <div class="wt-dialog-foot"><button class="wt-btn text secondary" data-close>ยกเลิก</button><button class="wt-btn" data-close>ยืนยันนัดหมาย</button></div></div>`);
  }
  function alertBox() {
    modal(`<div class="wt-dialog alert" role="alertdialog" aria-modal="true" aria-labelledby="pv-al-t">
      <div class="wt-alert-icon">${ic('trash')}</div>
      <div class="wt-dialog-head"><h3 id="pv-al-t">ลบใบสมัครนี้?</h3></div>
      <div class="wt-dialog-body">ใบสมัคร M1-2569-0001 จะถูกลบถาวรและกู้คืนไม่ได้</div>
      <div class="wt-dialog-foot"><button class="wt-btn secondary" data-close>ยกเลิก</button><button class="wt-btn danger" data-close>ลบใบสมัคร</button></div></div>`);
  }

  // ---------- binding ----------
  function mount(frame, scroll, layer) {
    overlayEl = layer;
    const render = () => { scroll.innerHTML = `<div class="pv-page">${TABS[st.tab]()}</div>`; };
    const rerender = (focusId) => {
      render();
      if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); if (el.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length); } }
    };

    frame.addEventListener('pointerdown', (e) => {
      const b = e.target.closest('.wt-btn');
      if (!b || frame.dataset.ripple !== 'true' || b.disabled) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      const ink = document.createElement('span');
      ink.className = 'wt-ripple-ink';
      Object.assign(ink.style, { width: s + 'px', height: s + 'px', left: e.clientX - r.left - s / 2 + 'px', top: e.clientY - r.top - s / 2 + 'px' });
      b.appendChild(ink);
      setTimeout(() => ink.remove(), 560);
    });

    scroll.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action],[data-goto]');
      if (!el) { if (st.open && !e.target.closest('.wt-panel')) { st.open = null; rerender(); } return; }
      if (el.dataset.goto) { global.dispatchEvent(new CustomEvent('wt-goto', { detail: el.dataset.goto })); return; }
      const a = el.dataset.action;
      if (a === 'toggle') { st.open = st.open === el.dataset.key ? null : el.dataset.key; if (el.dataset.key === 'birth') st.calView = new Date(st.birth.getFullYear(), st.birth.getMonth(), 1); rerender(); }
      else if (a === 'pick') { st[el.dataset.key] = el.dataset.val; st.open = null; rerender('pv-' + el.dataset.key); }
      else if (a === 'cal') { e.stopPropagation(); st.calView = new Date(st.calView.getFullYear(), st.calView.getMonth() + Number(el.dataset.dir), 1); rerender(); }
      else if (a === 'day') { st.birth = new Date(st.calView.getFullYear(), st.calView.getMonth(), Number(el.dataset.d)); st.open = null; rerender('pv-birth'); }
      else if (a === 'plan') st.plan = el.value;
      else if (a === 'row') { const i = Number(el.dataset.i); st.sel.has(i) ? st.sel.delete(i) : st.sel.add(i); rerender('pv-row-' + i); }
      else if (a === 'page') { st.page = Number(el.dataset.p); rerender(); }
      else if (a === 'gtab') { el.parentElement.querySelectorAll('.wt-tab').forEach((t) => t.classList.toggle('active', t === el)); }
      else if (a === 'toast') toast('บันทึกแล้ว', 'ระบบบันทึกข้อมูลเรียบร้อย');
      else if (a === 'dialog') dialog();
      else if (a === 'alert') alertBox();
    });

    scroll.addEventListener('input', (e) => {
      const el = e.target;
      if (el.dataset.action === 'search') { st.q = el.value; st.page = 1; rerender('pv-q'); }
      else if (el.dataset.action === 'cid') {
        st.id = el.value.replace(/\D/g, '').slice(0, 13);
        el.value = fmtId(st.id);
        const ok = validId(st.id), help = document.getElementById('pv-cid-help');
        el.classList.toggle('invalid', !ok);
        help.classList.toggle('error', !ok);
        help.textContent = ok ? 'เลขถูกต้อง (ตรวจหลักสุดท้ายแล้ว)' : st.id.length < 13 ? `กรอกแล้ว ${st.id.length} จาก 13 หลัก` : 'เลขไม่ถูกต้อง ตรวจอีกครั้ง';
      }
    });

    scroll.addEventListener('submit', (e) => {
      e.preventDefault();
      if (st.busy) return;
      st.busy = true; rerender();
      setTimeout(() => { st.busy = false; rerender(); toast('ส่งใบสมัครแล้ว', 'เลขที่สมัคร M1-2569-0001'); }, 1200);
    });

    render();
    return {
      setTab(id) { st.tab = id; st.open = null; render(); scroll.scrollTop = 0; },
      get tab() { return st.tab; },
    };
  }

  global.WTPreview = { mount, tabs: Object.keys(TABS) };
})(window);
