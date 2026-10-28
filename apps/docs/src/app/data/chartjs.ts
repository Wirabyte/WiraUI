import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const MONTHS = `['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.']`;

export const CHARTJS_DOC: ComponentDoc = {
  id: 'chartjs',
  title: 'ChartJS',
  group: 'Charts',
  entry: 'chartjs',
  standalone: 'WtChartJs',
  module: 'WtChartJsModule',
  selector: 'wt-chartjs',
  requires: [
    {
      name: 'Chart.js',
      install: 'npm install chart.js',
      url: 'https://www.chartjs.org',
      note: { th: 'รุ่น 3 หรือ 4', en: 'version 3 or 4' },
    },
  ],
  description: {
    th: 'กราฟแท่ง เส้น วงกลม และแบบอื่น ๆ ด้วย Chart.js ใช้ฟอนต์และสีตัวอักษรของธีมให้เอง และไม่กว้างเกินกล่องที่อยู่',
    en: 'Bar, line, pie and other charts drawn by Chart.js. They take the theme\'s font and text colour, and never get wider than their container.',
  },
  english: {
    'ม.ค.': 'Jan',
    'ก.พ.': 'Feb',
    'มี.ค.': 'Mar',
    'เม.ย.': 'Apr',
    'พ.ค.': 'May',
    'มิ.ย.': 'Jun',
    'จ.': 'Mon',
    'อ.': 'Tue',
    'พ.': 'Wed',
    'พฤ.': 'Thu',
    'ศ.': 'Fri',
    'ส.': 'Sat',
    'อา.': 'Sun',
    'รายรับ': 'Income',
    'รายจ่าย': 'Expenses',
    'รายรับและรายจ่ายรายเดือน': 'Monthly income and expenses',
    'ผู้เข้าชมเว็บไซต์': 'Website visitors',
    'ผู้เข้าชมรายวัน': 'Daily visitors',
    'อาหาร': 'Food',
    'เดินทาง': 'Travel',
    'อุปกรณ์การเรียน': 'School supplies',
    'อื่น ๆ': 'Other',
    'ค่าใช้จ่ายตามหมวด': 'Spending by category',
    'ม.1': 'Grade 7',
    'ม.2': 'Grade 8',
    'ม.3': 'Grade 9',
    'ชาย': 'Boys',
    'หญิง': 'Girls',
    'นักเรียนแยกตามชั้นและเพศ': 'Students by grade and gender',
    "แท่งแนวนอน (indexAxis: 'y') และซ้อนกัน (stacked)": "horizontal bars (indexAxis: 'y'), stacked",
    'ยอดขาย': 'Sales',
    'เป้าหมาย': 'Target',
    'ยอดขายเทียบเป้าหมาย': 'Sales against target',
    'type ของแต่ละ dataset ทับ type ของกราฟได้: แท่งกับเส้นในกราฟเดียว': "each dataset's type overrides the chart's: bars and a line in one chart",
    'ปีนี้': 'This year',
    'ปีที่แล้ว': 'Last year',
    'รายรับปีนี้เทียบปีที่แล้ว': 'Income this year against last year',
    'ใช้สีของธีมตอนนี้': 'Use the current theme colours',
    'object ใหม่ กราฟจึงสร้างใหม่ด้วยสีของธีมตอนนี้ (เช่น หลังเปลี่ยนธีมหรือโหมดมืด)':
      'a new object, so the chart is built again with the current theme colours (after a theme or dark-mode change, say)',
    'คณิตศาสตร์': 'Math',
    'วิทยาศาสตร์': 'Science',
    'ภาษาไทย': 'Thai',
    'ภาษาอังกฤษ': 'English',
    'สังคมศึกษา': 'Social studies',
    'คะแนนเฉลี่ย': 'Average score',
    'คะแนนเฉลี่ยรายวิชา': 'Average score by subject',
    'คลิกที่แท่ง': 'Click a bar',
    'ที่เลือก': 'Picked',
    'ประถม': 'Primary',
    'มัธยมต้น': 'Lower secondary',
    'มัธยมปลาย': 'Upper secondary',
    'นักเรียนแยกตามระดับชั้น': 'Students by level',
    '1,250 คน': '1,250 students',
    'ค่าที่ส่งให้ปลั๊กอินตาม id': 'options for the plugin, by its id',
    'ปลั๊กอินที่เขียนเอง: ตัวเลขกลางโดนัท ไม่ต้องลงแพ็กเกจเพิ่ม': 'a plugin of your own: a number in the middle of the doughnut, no extra package',
    'กว้างเต็มกล่อง สูง 200px': 'full width, 200px tall',
    'กว้าง 480px แต่ไม่เกินกล่องที่อยู่ (จอแคบหดตาม)': '480px wide, never wider than its container (it shrinks on narrow screens)',
    'สัปดาห์': 'Week',
    'นักเรียนที่มาเรียน': 'Students present',
    'นักเรียนที่มาเรียนรายสัปดาห์': 'Students present each week',
    'เพิ่มสัปดาห์': 'Add a week',
    'จำนวนจุด': 'Points',
    'แก้ data ที่เดิม แล้วสั่งวาดใหม่': 'change the data in place, then redraw',
    'ของ Chart.js: { datasetIndex, index, element }': "Chart.js's: { datasetIndex, index, element }",
    'ทุก element ของ dataset ที่คลิก': 'every element of the dataset clicked',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtChartJsModule</code>) และ standalone (<code>WtChartJs</code>) และอ้างถึงด้วย <code>#c="wtChartJs"</code> ได้ wt-chartjs วาดด้วย Chart.js (โหลด <code>chart.js/auto</code> ซึ่งมีกราฟครบทุกแบบ) แอปต้องติดตั้ง Chart.js 3 หรือ 4 เองด้วย <code>npm install chart.js</code> เป็น peer dependency แบบไม่บังคับ แอปที่ไม่ใช้กราฟจึงไม่ต้องลง',
        en: 'Works as an NgModule (<code>WtChartJsModule</code>) or standalone (<code>WtChartJs</code>), and is exported as <code>#c="wtChartJs"</code>. wt-chartjs draws with Chart.js (it loads <code>chart.js/auto</code>, which has every chart type). The app installs Chart.js 3 or 4 itself with <code>npm install chart.js</code>: it is an optional peer dependency, so apps without charts never need it.',
      },
    },
    basic: {
      title: { th: 'กราฟแท่ง', en: 'Bar chart' },
      text: {
        th: '<code>type</code> ชนิดกราฟ <code>[data]</code> คือ <code>{ labels, datasets }</code> ของ Chart.js และ <code>[options]</code> คือ options ของ Chart.js ส่ง object ใหม่เมื่อไหร่กราฟก็สร้างใหม่ (ถ้าแก้ข้อมูลที่เดิม ดูหัวข้อ refresh) <code>height</code> ทำให้กราฟกว้างเต็มกล่องและสูงตามนั้น',
        en: '<code>type</code> picks the chart, <code>[data]</code> is Chart.js\'s <code>{ labels, datasets }</code> and <code>[options]</code> its options. A new object rebuilds the chart (to change data in place, see refresh). With <code>height</code>, the chart fills the width at that height.',
      },
    },
    line: {
      title: { th: 'กราฟเส้น', en: 'Line chart' },
      text: {
        th: '<code>type="line"</code> · <code>fill: true</code> ระบายสีใต้เส้น และ <code>tension</code> ทำให้เส้นโค้ง',
        en: '<code>type="line"</code> · <code>fill: true</code> shades the area under the line and <code>tension</code> curves it.',
      },
    },
    pie: {
      title: { th: 'วงกลมและโดนัท', en: 'Pie and doughnut' },
      text: {
        th: '<code>type="pie"</code> หรือ <code>"doughnut"</code> ใช้ข้อมูลชุดเดียวกัน สีของแต่ละชิ้นเป็น array ใน <code>backgroundColor</code>',
        en: '<code>type="pie"</code> or <code>"doughnut"</code> take the same data; each slice\'s colour is an entry of the <code>backgroundColor</code> array.',
      },
    },
    stacked: {
      title: { th: 'แท่งแนวนอนและซ้อนกัน', en: 'Horizontal and stacked' },
      text: {
        th: '<code>indexAxis: \'y\'</code> ใน options ทำให้แท่งเป็นแนวนอน และ <code>stacked: true</code> ที่แกนทั้งสองทำให้ dataset ซ้อนกัน',
        en: '<code>indexAxis: \'y\'</code> in the options lays the bars sideways, and <code>stacked: true</code> on both axes stacks the datasets.',
      },
    },
    mixed: {
      title: { th: 'แท่งกับเส้นในกราฟเดียว', en: 'Bars and a line together' },
      text: {
        th: 'ใส่ <code>type</code> ที่ dataset ได้ ทับ type ของกราฟ เช่น ยอดขายเป็นแท่งและเป้าหมายเป็นเส้น',
        en: 'A dataset can carry its own <code>type</code>, overriding the chart\'s: sales as bars and the target as a line.',
      },
    },
    theme: {
      title: { th: 'สีจากธีม', en: 'Theme colours' },
      text: {
        th: 'อ่านสีของธีมจาก CSS variable ด้วย <code>getComputedStyle</code> เช่น <code>--wt-primary-color</code> และ <code>--wt-primary-300</code> แล้วใส่ใน dataset สีเปลี่ยนเมื่อเปลี่ยนธีมหรือโหมดมืด จึงสร้าง data ใหม่ตอนนั้น (ลองเปลี่ยนธีมที่ปุ่มด้านบนของเว็บ แล้วกดปุ่มในตัวอย่าง)',
        en: 'Read theme colours from CSS variables with <code>getComputedStyle</code>, such as <code>--wt-primary-color</code> and <code>--wt-primary-300</code>, and put them in the datasets. They change with the theme or dark mode, so build new data then (change the theme with the button at the top of the site, then press the button in the sample).',
      },
    },
    click: {
      title: { th: 'คลิกที่ข้อมูล', en: 'Click on data' },
      text: {
        th: '<code>(onDataSelect)</code> ส่ง <code>{ originalEvent, element, dataset }</code> เมื่อคลิกที่แท่ง จุด หรือชิ้น <code>element.index</code> คือลำดับใน <code>labels</code> และ <code>element.datasetIndex</code> คือ dataset ที่คลิก',
        en: '<code>(onDataSelect)</code> brings <code>{ originalEvent, element, dataset }</code> when a bar, point or slice is clicked: <code>element.index</code> is the position in <code>labels</code> and <code>element.datasetIndex</code> the dataset clicked.',
      },
    },
    plugins: {
      title: { th: 'ปลั๊กอิน', en: 'Plugins' },
      text: {
        th: '<code>[plugins]</code> รับปลั๊กอินของ Chart.js สำหรับกราฟนี้ เขียนเองเป็น object สั้น ๆ ได้ไม่ต้องลงแพ็กเกจ ตัวอย่างนี้วาดตัวเลขกลางโดนัท และรับค่าจาก <code>options.plugins.centerText</code> ตาม <code>id</code> ของปลั๊กอิน',
        en: '<code>[plugins]</code> takes Chart.js plugins for this chart. A short object of your own works, with no package to install: this one draws a number in the middle of the doughnut and reads its text from <code>options.plugins.centerText</code>, by the plugin\'s <code>id</code>.',
      },
    },
    size: {
      title: { th: 'ขนาดและ responsive', en: 'Size and responsive' },
      text: {
        th: '<code>responsive</code> เปิดเป็นค่าเริ่มต้น: ไม่ใส่ขนาด กราฟกว้างเต็มกล่องตามสัดส่วนของ Chart.js ใส่ <code>height</code> เพื่อกำหนดความสูง หรือ <code>width</code> เพื่อจำกัดความกว้าง กราฟไม่กว้างเกินกล่องที่อยู่ จอแคบจึงหดตาม <code>[responsive]="false"</code> ใช้ขนาดตายตัว',
        en: '<code>responsive</code> is on by default: with no size the chart fills the width at Chart.js\'s aspect ratio. Give a <code>height</code> to set the height, or a <code>width</code> to cap the width. A chart never gets wider than its container, so it shrinks on narrow screens. <code>[responsive]="false"</code> keeps a fixed size.',
      },
    },
    refresh: {
      title: { th: 'แก้ข้อมูลแล้ววาดใหม่ (refresh)', en: 'Change data, then refresh' },
      text: {
        th: 'ถ้าแก้ <code>data</code> ที่เดิม (push ค่าใหม่) กราฟยังไม่รู้ ให้เรียก <code>refresh()</code> ผ่าน template reference <code>#attendanceChart="wtChartJs"</code> หรือ <code>@ViewChild</code> ส่วนการส่ง object ใหม่ให้ <code>[data]</code> สร้างกราฟใหม่เอง',
        en: 'When you change <code>data</code> in place (pushing a value), the chart does not know: call <code>refresh()</code> through a template reference, <code>#attendanceChart="wtChartJs"</code>, or <code>@ViewChild</code>. Passing a new object to <code>[data]</code> rebuilds the chart on its own.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-chart&gt;</code> เป็น <code>&lt;wt-chartjs&gt;</code> (v1 / v2 ใช้ชื่อ <code>&lt;wt-chart&gt;</code> ได้ด้วย เป็น component เดียวกัน ส่วน v3 <code>&lt;wt-chart&gt;</code> คือกราฟของ WiraTheme เองที่รับ data / options แบบเดียวกันโดยไม่ต้องลง Chart.js) input เดิมใช้ได้ทั้งหมด (type, data, options, plugins, width, height, responsive) และ <code>(onDataSelect)</code> ส่งค่าแบบเดิม Chart.js ยังเป็นของแอปเอง (3 หรือ 4) ส่วน <code>generateLegend()</code> มีไว้ให้โค้ดเดิม',
        en: 'Change <code>&lt;p-chart&gt;</code> to <code>&lt;wt-chartjs&gt;</code> (in v1 / v2 <code>&lt;wt-chart&gt;</code> is the same component; in v3 <code>&lt;wt-chart&gt;</code> is WiraTheme’s own chart, which takes the same data and options without Chart.js). Every existing input works (type, data, options, plugins, width, height, responsive) and <code>(onDataSelect)</code> sends the same value. Chart.js stays the app\'s own (3 or 4); <code>generateLegend()</code> is kept for existing code.',
      },
    },
  },
  code: {
    basic: `<wt-chartjs type="bar" [data]="salesData" height="280px" ariaLabel="รายรับและรายจ่ายรายเดือน"></wt-chartjs>`,
    line: `<wt-chartjs type="line" [data]="visitData" [options]="visitOptions" height="280px" ariaLabel="ผู้เข้าชมรายวัน"></wt-chartjs>`,
    pie: `<wt-chartjs type="pie" [data]="spendData" height="260px" ariaLabel="ค่าใช้จ่ายตามหมวด"></wt-chartjs>
<wt-chartjs type="doughnut" [data]="spendData" height="260px" ariaLabel="ค่าใช้จ่ายตามหมวด"></wt-chartjs>`,
    stacked: `<wt-chartjs type="bar" [data]="genderData" [options]="stackedOptions" height="240px" ariaLabel="นักเรียนแยกตามชั้นและเพศ"></wt-chartjs>`,
    mixed: `<wt-chartjs type="bar" [data]="targetData" height="280px" ariaLabel="ยอดขายเทียบเป้าหมาย"></wt-chartjs>`,
    theme: `<wt-chartjs type="bar" [data]="themeData" height="260px" ariaLabel="รายรับปีนี้เทียบปีที่แล้ว"></wt-chartjs>
<wt-button label="ใช้สีของธีมตอนนี้" icon="wi wi-palette" severity="secondary" [outlined]="true" (onClick)="useThemeColors()"></wt-button>`,
    click: `<wt-chartjs type="bar" [data]="scoreData" [options]="scoreOptions" height="260px" ariaLabel="คะแนนเฉลี่ยรายวิชา"
  (onDataSelect)="pick($event)"></wt-chartjs>
<p>ที่เลือก: {{ picked }}</p>`,
    plugins: `<wt-chartjs type="doughnut" [data]="levelData" [options]="levelOptions" [plugins]="[centerText]" height="260px"
  ariaLabel="นักเรียนแยกตามระดับชั้น"></wt-chartjs>`,
    size: `<!-- กว้างเต็มกล่อง สูง 200px -->
<wt-chartjs type="line" [data]="visitData" height="200px" ariaLabel="ผู้เข้าชมรายวัน"></wt-chartjs>

<!-- กว้าง 480px แต่ไม่เกินกล่องที่อยู่ (จอแคบหดตาม) -->
<wt-chartjs type="bar" [data]="salesData" width="480px" height="200px" ariaLabel="รายรับและรายจ่ายรายเดือน"></wt-chartjs>`,
    refresh: `<wt-chartjs #attendanceChart="wtChartJs" type="line" [data]="attendance" height="240px"
  ariaLabel="นักเรียนที่มาเรียนรายสัปดาห์"></wt-chartjs>
<wt-button label="เพิ่มสัปดาห์" icon="wi wi-plus" (onClick)="addWeek(attendanceChart)"></wt-button>`,
  },
  ts: {
    basic: `import { ChartData } from 'chart.js';

salesData: ChartData<'bar'> = {
  labels: ${MONTHS},
  datasets: [
    { label: 'รายรับ', data: [52, 61, 70, 66, 74, 80], backgroundColor: '#3b82f6' },
    { label: 'รายจ่าย', data: [40, 45, 52, 48, 55, 58], backgroundColor: '#f59e0b' },
  ],
};`,
    line: `import { ChartData, ChartOptions } from 'chart.js';

visitData: ChartData<'line'> = {
  labels: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
  datasets: [
    {
      label: 'ผู้เข้าชมเว็บไซต์',
      data: [320, 410, 380, 460, 520, 280, 240],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      fill: true,
      tension: 0.35,
    },
  ],
};
visitOptions: ChartOptions<'line'> = {
  scales: { y: { beginAtZero: true } },
};`,
    pie: `spendData: ChartData<'pie'> = {
  labels: ['อาหาร', 'เดินทาง', 'อุปกรณ์การเรียน', 'อื่น ๆ'],
  datasets: [{ data: [4200, 1800, 1200, 600], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#a855f7'] }],
};`,
    stacked: `genderData: ChartData<'bar'> = {
  labels: ['ม.1', 'ม.2', 'ม.3'],
  datasets: [
    { label: 'ชาย', data: [118, 124, 109], backgroundColor: '#3b82f6' },
    { label: 'หญิง', data: [126, 119, 131], backgroundColor: '#ec4899' },
  ],
};
// แท่งแนวนอน (indexAxis: 'y') และซ้อนกัน (stacked)
stackedOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  scales: { x: { stacked: true }, y: { stacked: true } },
};`,
    mixed: `// type ของแต่ละ dataset ทับ type ของกราฟได้: แท่งกับเส้นในกราฟเดียว
targetData: ChartData<'bar' | 'line'> = {
  labels: ${MONTHS},
  datasets: [
    { type: 'bar', label: 'ยอดขาย', data: [48, 55, 62, 58, 71, 76], backgroundColor: '#3b82f6' },
    { type: 'line', label: 'เป้าหมาย', data: [50, 55, 60, 65, 70, 75], borderColor: '#f43f5e', backgroundColor: '#f43f5e', tension: 0.3 },
  ],
};`,
    theme: `themeData = this.themeChartData();

useThemeColors(): void {
  // object ใหม่ กราฟจึงสร้างใหม่ด้วยสีของธีมตอนนี้ (เช่น หลังเปลี่ยนธีมหรือโหมดมืด)
  this.themeData = this.themeChartData();
}

themeChartData(): ChartData<'bar'> {
  const css = getComputedStyle(document.documentElement);
  return {
    labels: ${MONTHS},
    datasets: [
      { label: 'ปีนี้', data: [52, 61, 70, 66, 74, 80], backgroundColor: css.getPropertyValue('--wt-primary-color').trim() },
      { label: 'ปีที่แล้ว', data: [45, 50, 58, 60, 63, 69], backgroundColor: css.getPropertyValue('--wt-primary-300').trim() },
    ],
  };
}`,
    click: `import { ChartData, ChartOptions } from 'chart.js';
import { WtChartJsDataSelectEvent } from 'wiratheme/chartjs';

scoreData: ChartData<'bar'> = {
  labels: ['คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาไทย', 'ภาษาอังกฤษ', 'สังคมศึกษา'],
  datasets: [{ label: 'คะแนนเฉลี่ย', data: [72, 68, 81, 75, 70], backgroundColor: '#6366f1' }],
};
scoreOptions: ChartOptions<'bar'> = {
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 100 } },
};
picked = 'คลิกที่แท่ง';

pick(event: WtChartJsDataSelectEvent): void {
  const { datasetIndex, index } = event.element as { datasetIndex: number; index: number };
  this.picked = this.scoreData.labels![index] + ': ' + this.scoreData.datasets[datasetIndex].data[index];
}`,
    plugins: `import { ChartData, Plugin } from 'chart.js';

levelData: ChartData<'doughnut'> = {
  labels: ['ประถม', 'มัธยมต้น', 'มัธยมปลาย'],
  datasets: [{ data: [520, 410, 320], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'] }],
};
levelOptions = {
  cutout: '65%',
  plugins: {
    legend: { position: 'bottom' },
    centerText: { text: '1,250 คน' },   // ค่าที่ส่งให้ปลั๊กอินตาม id
  },
};

// ปลั๊กอินที่เขียนเอง: ตัวเลขกลางโดนัท ไม่ต้องลงแพ็กเกจเพิ่ม
centerText: Plugin<'doughnut', { text: string }> = {
  id: 'centerText',
  afterDraw(chart, _args, options) {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.font = '600 18px ' + (chart.options.font?.family ?? 'sans-serif');
    ctx.fillStyle = String(chart.options.color ?? '#333');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.text, (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2);
    ctx.restore();
  },
};`,
    refresh: `import { ChartData } from 'chart.js';
import { WtChartJs } from 'wiratheme/chartjs';

attendance: ChartData<'line'> = {
  labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4', 'สัปดาห์ 5'],
  datasets: [{ label: 'นักเรียนที่มาเรียน', data: [1180, 1204, 1192, 1215, 1198], borderColor: '#10b981', tension: 0.3 }],
};

addWeek(chart: WtChartJs): void {
  // แก้ data ที่เดิม แล้วสั่งวาดใหม่
  const week = this.attendance.labels!.length + 1;
  this.attendance.labels!.push('สัปดาห์ ' + week);
  this.attendance.datasets[0].data.push(1150 + ((week * 37) % 80));
  chart.refresh();
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: {
        th: 'เปลี่ยน type, data หรือ options เป็นค่าใหม่เมื่อไหร่ กราฟสร้างใหม่ทั้งหมด',
        en: 'A new type, data or options value rebuilds the chart.',
      },
      rows: [
        row('type', "'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter'", "'bar'", 'ชนิดกราฟ', 'Chart type'),
        row('data', 'ChartData', undefined, '{ labels, datasets } ของ Chart.js (แก้ที่เดิมแล้วเรียก refresh())', "Chart.js's { labels, datasets } (after changes in place, call refresh())"),
        row('options', 'ChartOptions', undefined, 'options ของ Chart.js', 'Chart.js options'),
        row('plugins', 'Plugin[]', '[]', 'ปลั๊กอินของ Chart.js สำหรับกราฟนี้', 'Chart.js plugins for this chart'),
        row('width · height', 'string', undefined, "เช่น '480px', '100%' · มี height แล้วกราฟ responsive กว้างเต็มกล่องที่ความสูงนั้น", "e.g. '480px', '100%' · with a height, a responsive chart fills the width at that height"),
        row('responsive', 'boolean', 'true', 'ปรับขนาดตามกล่อง (false = ขนาดตายตัว)', 'Resize with the container (false = fixed size)'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อของกราฟ (canvas เป็น role="img")', 'Name of the chart (the canvas is role="img")'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของกล่องกราฟ', 'Chart box class / style'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onDataSelect', 'WtChartJsDataSelectEvent', undefined, 'คลิกที่แท่ง จุด หรือชิ้น', 'A bar, point or slice was clicked')],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน template reference เช่น #c="wtChartJs" หรือ @ViewChild(WtChartJs)', en: 'Call them through a template reference such as #c="wtChartJs", or @ViewChild(WtChartJs).' },
      rows: [
        row('refresh()', 'void', undefined, 'วาดใหม่ด้วย data ปัจจุบัน (หลังแก้ที่เดิม)', 'Redraw with the current data (after changes in place)'),
        row('reinit()', 'void', undefined, 'สร้างกราฟใหม่ทั้งหมด', 'Build the chart again from scratch'),
        row('getCanvas()', 'HTMLCanvasElement | null', undefined, 'canvas ของกราฟ', 'The chart canvas'),
        row('getBase64Image()', 'string | null', undefined, 'กราฟเป็นรูป PNG แบบ data URL', 'The chart as a PNG data URL'),
        row('chart', 'Chart | null', undefined, 'instance ของ Chart.js (property)', 'The Chart.js instance (a property)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WtChartJsDataSelectEvent } from 'wiratheme/chartjs';

interface WtChartJsDataSelectEvent {
  originalEvent: MouseEvent;
  element: unknown;     // ของ Chart.js: { datasetIndex, index, element }
  dataset: unknown[];   // ทุก element ของ dataset ที่คลิก
}`,
    },
  ],
  themingNote: {
    th: 'wt-chartjs ไม่มี token ของตัวเอง ตอนสร้างกราฟจะอ่านตัวแปรด้านล่างแล้วใช้เป็นฟอนต์ของกราฟ (ภาษาไทยด้วย) สีตัวอักษร และสีเส้น เว้นแต่แอปตั้ง <code>Chart.defaults</code> เองหรือส่ง <code>font</code> / <code>color</code> / <code>borderColor</code> มาใน options ส่วนสีของ dataset เป็นค่าของ Chart.js ใช้สีของธีมได้โดยอ่านตัวแปร เช่น <code>getComputedStyle(document.documentElement).getPropertyValue(\'--wt-primary-color\')</code> (ดูหัวข้อสีจากธีมในแท็บตัวอย่าง) และสร้าง data ใหม่หลังเปลี่ยนธีม',
    en: 'wt-chartjs has no tokens of its own. When it builds a chart it reads the variables below and uses them for the chart\'s font (Thai included), text colour and line colour, unless the app set <code>Chart.defaults</code> itself or passes <code>font</code> / <code>color</code> / <code>borderColor</code> in the options. Dataset colours are Chart.js values: use the theme\'s by reading a variable, e.g. <code>getComputedStyle(document.documentElement).getPropertyValue(\'--wt-primary-color\')</code> (see Theme colours on the Examples tab), and build new data after a theme change.',
  },
  tokens: [
    tok('--wt-font-family', 'ฟอนต์ของกราฟ (ป้าย แกน คำอธิบาย)', 'Chart font (labels, axes, legend)'),
    tok('--wt-text-muted', 'สีตัวอักษรของกราฟ', 'Chart text colour'),
    tok('--wt-border', 'สีเส้นตารางและเส้นขอบ', 'Grid and border line colour'),
    tok('--wt-primary-color', 'สีหลัก ใช้ใน dataset ได้ (อ่านด้วย getComputedStyle)', 'The primary colour, for datasets (read it with getComputedStyle)'),
  ],
};
