import { CHART_DOC, CHART_MONTHS } from '../../data/chart';
import { SimpleDemo } from './demos';

/*
 * State behind the Chart page (wt-chart) (wiratheme@3 only, so only DocsV3Module declares it). Data goes through local() so
 * labels and series names follow the site language. "Random" data comes from a fixed sequence, so every run (and the
 * end-to-end tests) sees the same numbers.
 */

interface Series {
  name: string;
  data: (number | null)[] | { x: number; y: number; r?: number }[];
  type?: 'bar' | 'line' | 'area';
  axis?: 'left' | 'right';
  smooth?: boolean;
  dashed?: boolean;
}

export abstract class ChartDemo extends SimpleDemo {
  protected readonly doc = CHART_DOC;
  readonly months = CHART_MONTHS;
  readonly money: Series[] = [
    { name: 'รายรับ', data: [420000, 380000, 510000, 465000, 530000, 610000] },
    { name: 'รายจ่าย', data: [310000, 295000, 340000, 360000, 330000, 390000] },
  ];
  readonly visitors: Series[] = [
    { name: 'ผู้เข้าชม', data: [12500, 18200, 15800, 24100, 21900, 30400] },
    { name: 'สมัครเรียน', data: [820, 1340, 1210, 2050, 1890, 2610], smooth: false, dashed: true },
  ];
  readonly grades = ['ม.1', 'ม.2', 'ม.3'];
  readonly students: Series[] = [
    { name: 'ชาย', data: [132, 120, 115] },
    { name: 'หญิง', data: [128, 135, 124] },
  ];
  readonly channels = ['เพื่อน / ครอบครัว', 'โซเชียลมีเดีย', 'เว็บไซต์', 'ป้ายประกาศ', 'อื่น ๆ'];
  readonly applicants: Series[] = [{ name: 'ผู้สมัคร', data: [420, 365, 210, 95, 40] }];
  readonly salesAndGrowth: Series[] = [
    { name: 'ยอดขาย', data: [1200000, 1350000, 1280000, 1520000, 1610000, 1790000] },
    { name: 'อัตราเติบโต', type: 'line', axis: 'right', data: [0.04, 0.125, -0.052, 0.188, 0.059, 0.112] },
  ];
  readonly skills = ['ฟัง', 'พูด', 'อ่าน', 'เขียน', 'คิดวิเคราะห์'];
  readonly skillScores: Series[] = [
    { name: 'ห้อง ม.1/1', data: [4.2, 3.6, 4.5, 3.1, 3.9] },
    { name: 'ค่าเฉลี่ยระดับชั้น', data: [3.8, 3.4, 3.9, 3.3, 3.5], dashed: true },
  ];
  readonly readingVsScore: Series[] = [
    {
      name: 'นักเรียน',
      data: [
        { x: 1, y: 48 },
        { x: 2, y: 54 },
        { x: 3, y: 52 },
        { x: 4, y: 61 },
        { x: 5, y: 66, r: 9 },
        { x: 6, y: 63 },
        { x: 7, y: 72 },
        { x: 8, y: 78, r: 12 },
        { x: 9, y: 74 },
        { x: 10, y: 85 },
      ],
    },
  ];
  readonly budget = [{ value: 400000, label: 'งบประมาณ' }];
  readonly years = ['2564', '2565', '2566', '2567', '2568', '2569'];
  readonly tuition: Series[] = [{ name: 'ค่าเทอม', data: [12000, 12000, 13500, 13500, 15000, 15000] }];
  readonly attendance = ['การเข้าเรียนวันนี้'];
  readonly attendanceValue = [{ data: [87] }];
  readonly progressLabels = ['ส่งงาน', 'เข้าเรียน', 'กิจกรรม'];
  readonly progress = [{ data: [76, 92, 58] }];
  readonly days = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.'];
  readonly library: Series[] = [
    { name: '08:00', data: [12, 18, 9, 22, 14] },
    { name: '10:00', data: [35, 41, 28, 39, 30] },
    { name: '12:00', data: [58, 64, 49, 61, 70] },
    { name: '14:00', data: [27, 33, 25, 38, 21] },
    { name: '16:00', data: [44, 19, 52, 17, 8] },
  ];
  readonly ranges = [
    { from: 0, to: 20, color: '#22c55e', name: 'ว่าง' },
    { from: 21, to: 45, color: '#f59e0b', name: 'ปานกลาง' },
    { from: 46, to: 100, color: '#ef4444', name: 'แน่น' },
  ];
  readonly departments = ['บุคลากร', 'วิชาการ', 'อาคารสถานที่', 'กิจการนักเรียน', 'เทคโนโลยี', 'งบกลาง'];
  readonly budgets: Series[] = [{ name: 'งบประมาณ', data: [4800000, 3200000, 2100000, 1400000, 1100000, 900000] }];
  readonly kpiVisitors: Series[] = [{ name: 'ผู้เข้าชม', data: [12500, 18200, 15800, 24100, 21900, 30400] }];
  readonly kpiIncome: Series[] = [{ name: 'รายรับ', data: [420000, 380000, 510000, 465000, 530000, 610000] }];
  readonly kpiApplications: Series[] = [{ name: 'สมัครเรียน', data: [820, 1340, 1210, 2050, 1890, 2610] }];
  readonly notes = {
    y: [{ value: 20000, to: 26000, label: 'ช่วงเป้าหมาย', color: '#16a34a' }],
    x: [{ at: 'เม.ย.', to: 'พ.ค.', label: 'ปิดภาคเรียน' }],
    points: [{ at: 'มิ.ย.', value: 30400, label: 'สูงสุด' }],
  };
  readonly days30 = Array.from({ length: 30 }, (_, i) => String(i + 1));
  readonly daily: Series[] = [{ name: 'ผู้เข้าชมรายวัน', data: this.days30.map((_, i) => Math.round(900 + 420 * Math.sin(i / 3.2) + i * 28 + ((i * 7919) % 230))) }];
  zoomText = 'null';
  swapped = '-';

  /** The dynamic sample: the app's own control picks the kind. */
  ownKind = 'bar';
  readonly ownKinds = [
    { label: 'แท่ง', value: 'bar' },
    { label: 'เส้น', value: 'line' },
    { label: 'พื้นที่', value: 'area' },
    { label: 'สตรีม', value: 'stream' },
    { label: 'ตารางสี', value: 'heatmap' },
  ];
  readonly clubs: Series[] = [
    { name: 'ชมรมดนตรี', data: [30, 42, 38, 55, 48, 62] },
    { name: 'ชมรมกีฬา', data: [45, 40, 52, 48, 60, 58] },
    { name: 'ชมรมศิลปะ', data: [20, 28, 35, 30, 26, 40] },
    { name: 'ชมรมวิทย์', data: [15, 18, 22, 30, 36, 33] },
  ];
  readonly budgetSteps = ['งบต้นปี', 'ค่าเทอม', 'เงินบริจาค', 'ค่าสาธารณูปโภค', 'ค่ากิจกรรม', 'ซ่อมอาคาร', 'คงเหลือ'];
  readonly budgetFlow = [{ data: [500000, 320000, 85000, -140000, -210000, -180000, null] }];
  readonly subjects = ['คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาไทย', 'ภาษาอังกฤษ', 'สังคมศึกษา'];
  readonly beforeAfter: Series[] = [
    { name: 'ก่อนเรียน', data: [42, 48, 61, 39, 55] },
    { name: 'หลังเรียน', data: [68, 71, 66, 58, 52] },
  ];
  readonly project = [
    {
      name: 'โครงการ',
      data: [
        { row: 'วางแผน', start: '2026-05-01', end: '2026-05-10', name: 'เก็บความต้องการ' },
        { row: 'ออกแบบ', start: '2026-05-08', end: '2026-05-24', name: 'ออกแบบหน้าจอ' },
        { row: 'ออกแบบ', start: '2026-05-20', end: '2026-05-28', name: 'ทบทวนแบบ' },
        { row: 'พัฒนา', start: '2026-05-22', end: '2026-06-25', name: 'เขียนโค้ด' },
        { row: 'ทดสอบ', start: '2026-06-15', end: '2026-07-05', name: 'ทดสอบระบบ' },
        { row: 'เปิดใช้', start: '2026-07-06', end: '2026-07-09', name: 'เปิดใช้งาน', color: '#16a34a' },
      ],
    },
  ];
  readonly steps = ['เข้าชมเว็บไซต์', 'ดูหลักสูตร', 'กรอกใบสมัคร', 'ส่งเอกสาร', 'ชำระเงิน'];
  readonly admissions = [{ data: [12000, 6400, 2100, 1450, 980] }];
  readonly classes = ['ม.4/1', 'ม.4/2', 'ม.4/3', 'ม.4/4'];
  readonly scores = [{ name: 'คะแนน', data: [this.sample(30, 64, 11), this.sample(30, 58, 15), this.sample(30, 71, 8).concat([32]), this.sample(30, 61, 12)] }];
  readonly heights = [{ name: 'ส่วนสูง', data: this.sample(200, 160, 8).map((v) => Math.round(v * 10) / 10) }];
  readonly budgetTree = [
    {
      name: 'วิชาการ',
      children: [
        { name: 'คณิต', value: 900000 },
        { name: 'วิทย์', children: [{ name: 'ฟิสิกส์', value: 420000 }, { name: 'เคมี', value: 380000 }, { name: 'ชีวะ', value: 300000 }] },
        { name: 'ภาษา', value: 650000 },
      ],
    },
    { name: 'กิจการนักเรียน', children: [{ name: 'กีฬา', value: 520000 }, { name: 'ทัศนศึกษา', value: 380000 }] },
    {
      name: 'อาคารสถานที่',
      children: [
        { name: 'ซ่อมบำรุง', value: 610000 },
        { name: 'ก่อสร้าง', value: 900000 },
        { name: 'สาธารณูปโภค', children: [{ name: 'ไฟฟ้า', value: 280000 }, { name: 'น้ำประปา', value: 120000 }] },
      ],
    },
  ];
  readonly budgetSeries = [{ name: 'งบประมาณ', data: this.budgetTree }];
  readonly travel = ['เดิน', 'จักรยาน', 'รถรับส่ง', 'รถผู้ปกครอง', 'รถสาธารณะ'];
  readonly travelCounts: Series[] = [{ name: 'การเดินทางมาโรงเรียน', data: [120, 85, 210, 340, 95] }];
  readonly years2 = ['2568', '2569'];
  readonly yearScores: Series[] = [
    { name: 'คณิตศาสตร์', data: [52, 61] },
    { name: 'วิทยาศาสตร์', data: [58, 63] },
    { name: 'ภาษาไทย', data: [66, 64] },
    { name: 'ภาษาอังกฤษ', data: [45, 54] },
    { name: 'สังคมศึกษา', data: [60, 60] },
  ];

  zoomTo(e: { from: number; to: number } | null): void {
    this.zoomText = e ? `${e.from} – ${e.to}` : 'null';
  }
  readonly chartjsData = {
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.'],
    datasets: [
      { label: 'รายรับ', data: [42, 38, 51], backgroundColor: '#0f766e' },
      { label: 'รายจ่าย', data: [31, 29, 34], backgroundColor: '#f59e0b' },
    ],
  };
  readonly chartjsOptions = { plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };

  private seed = 7;
  live: Series[] = [{ name: 'ผู้เข้าชม', data: this.random() }];
  lastClick = '-';
  toggled = '-';

  shuffle(): void {
    this.live = [{ name: 'ผู้เข้าชม', data: this.random() }];
  }

  clicked(e: { label: string; value: number }): void {
    this.lastClick = `${e.label}: ${e.value}`;
  }

  seriesToggled(e: { name: string; hidden: boolean }): void {
    this.toggled = `${e.name}: ${e.hidden ? 'hidden' : 'shown'}`;
  }

  /** `count` values around `mean`, spread by `sd`: a fixed sequence (the same on every run), roughly normal. */
  private sample(count: number, mean: number, sd: number): number[] {
    let seed = Math.round(mean * 97 + sd * 13 + count);
    const next = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    return Array.from({ length: count }, () => {
      const u = Math.max(1e-9, next());
      return Math.round((mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * next())) * 10) / 10;
    });
  }

  /** The next "random" values: a fixed sequence (a small linear congruential generator). */
  private random(): number[] {
    return this.months.map(() => {
      this.seed = (this.seed * 1103515245 + 12345) % 2147483648;
      return 200 + (this.seed % 800);
    });
  }
}
