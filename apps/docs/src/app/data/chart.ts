import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

export const CHART_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];

export const CHART_DOC: ComponentDoc = {
  id: 'chart',
  title: 'Chart',
  group: 'Charts',
  entry: 'chart',
  standalone: 'WuChart',
  module: 'WuChartModule',
  selector: 'wu-chart',
  description: {
    th: 'กราฟของ WiraUI เอง วาดด้วย SVG ไม่ต้องติดตั้ง Chart.js: แท่ง (กลุ่ม ซ้อน แนวนอน) เส้น (โค้ง ขั้นบันได) พื้นที่ไล่สี วงกลม โดนัท วงแหวนและเกจ วงกลมแบบรัศมี เรดาร์ จุด/ฟอง heatmap และ treemap ผสมกันได้ มีกราฟจิ๋ว คำอธิบายบนกราฟ แถบเครื่องมือซูม และกราฟที่ชี้ไปด้วยกัน ข้อความเป็นตัวอักษรจริงในฟอนต์ของหน้า (ภาษาไทยไม่เพี้ยน) ตัวเลขแบบเงินบาท เปอร์เซ็นต์ หรือหน่วยไทย (พัน หมื่น แสน ล้าน) legend ซ่อนแสดงได้ tooltip ตามเมาส์หรือคีย์บอร์ด เคลื่อนไหวเมื่อข้อมูลเปลี่ยน และ export เป็น PNG / SVG / CSV ได้ · มีเฉพาะ wiraui@3 (v1 / v2 ใช้ ChartJS)',
    en: 'WiraUI’s own chart, drawn in SVG with no Chart.js: bars (grouped, stacked, across), lines (smooth, steps), fading areas, pie, doughnut, radial bars and gauges, polar area, radar, scatter / bubble, heatmap and treemap, mixed as you like, plus sparklines, annotations, a zoom toolbar and charts that point together. Text is real text in the page’s font (Thai shapes properly), values read as baht, percents or Thai units (พัน, หมื่น, แสน, ล้าน), the legend hides and shows series, the tooltip follows the pointer or the keyboard, data changes animate, and charts export as PNG, SVG or CSV · wiraui@3 only (v1 / v2: ChartJS).',
  },
  english: {
    'ม.ค.': 'Jan',
    'ก.พ.': 'Feb',
    'มี.ค.': 'Mar',
    'เม.ย.': 'Apr',
    'พ.ค.': 'May',
    'มิ.ย.': 'Jun',
    'รายรับ': 'Income',
    'รายจ่าย': 'Spending',
    'กำไร': 'Profit',
    'รายรับรายจ่าย ภาคเรียนที่ 2/2569': 'Income and spending, semester 2/2569',
    'หน่วย: บาท': 'In baht',
    'ผู้เข้าชม': 'Visitors',
    'สมัครเรียน': 'Applications',
    'เป้าหมาย': 'Target',
    'ม.1': 'Grade 7',
    'ม.2': 'Grade 8',
    'ม.3': 'Grade 9',
    'ชาย': 'Boys',
    'หญิง': 'Girls',
    'นักเรียนแต่ละชั้น': 'Students per grade',
    'ยอดขาย': 'Sales',
    'อัตราเติบโต': 'Growth',
    'ช่องทางที่ผู้สมัครรู้จักโรงเรียน': 'How applicants heard of the school',
    'เพื่อน / ครอบครัว': 'Friends / family',
    'โซเชียลมีเดีย': 'Social media',
    'เว็บไซต์': 'Website',
    'ป้ายประกาศ': 'Posters',
    'อื่น ๆ': 'Other',
    'ผู้สมัคร': 'Applicants',
    'ทักษะ': 'Skills',
    'ฟัง': 'Listening',
    'พูด': 'Speaking',
    'อ่าน': 'Reading',
    'เขียน': 'Writing',
    'คิดวิเคราะห์': 'Reasoning',
    'ห้อง ม.1/1': 'Class 7/1',
    'ค่าเฉลี่ยระดับชั้น': 'Grade average',
    'ชั่วโมงอ่านหนังสือ': 'Reading hours',
    'คะแนนสอบ': 'Exam score',
    'นักเรียน': 'Students',
    'สุ่มข้อมูลใหม่': 'New random data',
    'คลิกล่าสุด': 'Last click',
    'ดาวน์โหลด PNG': 'Download PNG',
    'ดาวน์โหลด SVG': 'Download SVG',
    'คน': 'people',
    ' คน': ' people',
    'งบประมาณ': 'Budget',
    'บาท': 'Baht',
    'จ.': 'Mon',
    'อ.': 'Tue',
    'พ.': 'Wed',
    'พฤ.': 'Thu',
    'ศ.': 'Fri',
    'ส่งงาน': 'Homework in',
    'เข้าเรียน': 'Attendance',
    'กิจกรรม': 'Activities',
    'การเข้าเรียนวันนี้': 'Attendance today',
    'ผู้ใช้ห้องสมุด': 'Library visitors',
    'ว่าง': 'Quiet',
    'ปานกลาง': 'Busy',
    'แน่น': 'Full',
    'วิชาการ': 'Academic',
    'กิจการนักเรียน': 'Student affairs',
    'อาคารสถานที่': 'Buildings',
    'บุคลากร': 'Staff',
    'เทคโนโลยี': 'Technology',
    'งบกลาง': 'Central fund',
    'ค่าเทอม': 'Tuition',
    'ปิดภาคเรียน': 'Break',
    'สูงสุด': 'Peak',
    'ช่วงเป้าหมาย': 'Target range',
    'ผู้เข้าชมรายวัน': 'Daily visitors',
    'ลากบนกราฟเพื่อซูม': 'Drag across the chart to zoom',
    'คะแนนเฉลี่ย': 'Average score',
    'เดิม': 'Before',
    'สมมาตร': 'Silhouette',
    'ลื่นไหล': 'Wiggle',
    'สัดส่วน': 'Shares',
    'แท่ง': 'Bars',
    'ขั้นบันได': 'Steps',
    'จุด': 'Dots',
    'ลูกศร': 'Arrows',
    'ช่วง': 'Range',
    'เส้นบาง': 'Thin',
    'กรวย': 'Funnel',
    'พีระมิด': 'Pyramid',
    'กล่อง': 'Box',
    'ไวโอลิน': 'Violin',
    'จุดข้อมูล': 'Points',
    'ความหนาแน่น': 'Density',
    'สี่เหลี่ยม': 'Squares',
    'วงกลม': 'Circles',
    'รังผึ้ง': 'Honeycomb',
    'ซันเบิร์สต์': 'Sunburst',
    'ไอซิเคิล': 'Icicle',
    'วาฟเฟิล': 'Waffle',
    'รูปคน': 'People',
    'เส้น': 'Lines',
    'เน้นขึ้นลง': 'Up and down',
    'ชมรมดนตรี': 'Music club',
    'ชมรมกีฬา': 'Sports club',
    'ชมรมศิลปะ': 'Art club',
    'ชมรมวิทย์': 'Science club',
    'งบต้นปี': 'Opening budget',
    'เงินบริจาค': 'Donations',
    'ค่าสาธารณูปโภค': 'Utilities',
    'สาธารณูปโภค': 'Utilities',
    'พื้นที่': 'Area',
    'สตรีม': 'Stream',
    'ตารางสี': 'Heatmap',
    'ค่ากิจกรรม': 'Activities',
    'ซ่อมอาคาร': 'Repairs',
    'คงเหลือ': 'Left over',
    'คณิตศาสตร์': 'Maths',
    'วิทยาศาสตร์': 'Science',
    'ภาษาไทย': 'Thai',
    'ภาษาอังกฤษ': 'English',
    'สังคมศึกษา': 'Social studies',
    'ก่อนเรียน': 'Before',
    'หลังเรียน': 'After',
    'วางแผน': 'Plan',
    'ออกแบบ': 'Design',
    'พัฒนา': 'Build',
    'ทดสอบ': 'Test',
    'เปิดใช้': 'Launch',
    'เก็บความต้องการ': 'Requirements',
    'ออกแบบหน้าจอ': 'Screens',
    'ทบทวนแบบ': 'Review',
    'เขียนโค้ด': 'Coding',
    'ทดสอบระบบ': 'Testing',
    'เปิดใช้งาน': 'Go live',
    'โครงการ': 'Project',
    'เข้าชมเว็บไซต์': 'Visited the site',
    'ดูหลักสูตร': 'Read a course',
    'กรอกใบสมัคร': 'Filled the form',
    'ส่งเอกสาร': 'Sent documents',
    'ชำระเงิน': 'Paid',
    'ม.4/1': 'Class 10/1',
    'ม.4/2': 'Class 10/2',
    'ม.4/3': 'Class 10/3',
    'ม.4/4': 'Class 10/4',
    'คะแนน': 'Score',
    'ส่วนสูง (ซม.)': 'Height (cm)',
    'ส่วนสูง': 'Height',
    'คณิต': 'Maths',
    'วิทย์': 'Science',
    'ภาษา': 'Languages',
    'ฟิสิกส์': 'Physics',
    'เคมี': 'Chemistry',
    'ชีวะ': 'Biology',
    'กีฬา': 'Sports',
    'ทัศนศึกษา': 'Trips',
    'ซ่อมบำรุง': 'Upkeep',
    'ก่อสร้าง': 'Building',
    'ไฟฟ้า': 'Power',
    'น้ำประปา': 'Water',
    'เดิน': 'Walk',
    'จักรยาน': 'Bicycle',
    'รถรับส่ง': 'School bus',
    'รถผู้ปกครอง': 'Parents’ car',
    'รถสาธารณะ': 'Public transport',
    'การเดินทางมาโรงเรียน': 'How students get to school',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuChartModule</code>) และ standalone (<code>WuChart</code>) · ไม่ต้องติดตั้งอะไรเพิ่ม · กราฟที่วาดด้วย Chart.js อยู่ที่ <code>wiraui/chartjs</code> (<code>&lt;wu-chartjs&gt;</code>) ใช้คู่กันในแอปเดียวได้',
        en: 'Works as an NgModule (<code>WuChartModule</code>) or standalone (<code>WuChart</code>) · nothing else to install · the Chart.js chart is <code>wiraui/chartjs</code> (<code>&lt;wu-chartjs&gt;</code>); both can live in one app.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[labels]</code> คือป้ายของแกน และ <code>[series]</code> คือชุดข้อมูล <code>{ name, data }</code> (ค่าละหนึ่งตัวต่อป้าย <code>null</code> คือไม่มีค่า) · สีมาจากธีม (<code>--wu-chart-1</code> คือสีหลักของ preset) จึงเข้ากับทุก preset และโหมดมืด · กว้างเต็มพื้นที่ สูง 320px (เปลี่ยนด้วย <code>height</code>) และวาดใหม่เมื่อขนาดเปลี่ยน · ชี้หรือแตะดู tooltip คลิก legend เพื่อซ่อน / แสดงชุดข้อมูล',
        en: '<code>[labels]</code> are the axis labels and <code>[series]</code> the data sets, <code>{ name, data }</code> (one value per label, <code>null</code> for none) · colours come from the theme (<code>--wu-chart-1</code> is the preset’s primary), so every preset and dark mode fit · it fills the width at 320px high (<code>height</code> changes it) and redraws when the size changes · point or tap for the tooltip, click the legend to hide or show a series.',
      },
    },
    line: {
      title: { th: 'เส้นและพื้นที่', en: 'Lines and areas' },
      text: {
        th: '<code>type="line"</code> หรือ <code>"area"</code> · <code>smooth</code> เส้นโค้งที่ไม่เกินจุดข้อมูล · ในแต่ละชุด <code>dashed</code> เส้นประ, <code>fill</code> ระบายใต้เส้น, <code>smooth</code> เฉพาะชุด · <code>stacked</code> พื้นที่ซ้อนกัน · เส้นตามแนวเมาส์และจุดของทุกชุดขึ้นพร้อมกัน',
        en: '<code>type="line"</code> or <code>"area"</code> · <code>smooth</code> curves that never overshoot the data · per series: <code>dashed</code>, <code>fill</code> under the line, its own <code>smooth</code> · <code>stacked</code> stacks areas · a guide line follows the pointer and every series’ point lights up together.',
      },
    },
    bars: {
      title: { th: 'แท่งซ้อนและแนวนอน', en: 'Stacked and horizontal bars' },
      text: {
        th: '<code>stacked</code> ซ้อนทุกชุด หรือใส่ <code>stack</code> ให้ชุดที่ซ้อนกัน (กลุ่มอื่นวางข้างกัน) · <code>horizontal</code> แท่งแนวนอน ป้ายยาว ๆ อ่านง่าย · <code>showValues</code> แสดงค่าบนแท่ง · ปลายแท่งมนเฉพาะด้านนอกของกอง (<code>barRadius</code>)',
        en: '<code>stacked</code> stacks every series, or give the series that stack together a <code>stack</code> key (other groups stand side by side) · <code>horizontal</code> bars run across, easy with long labels · <code>showValues</code> writes the values · only the outer end of a stack is rounded (<code>barRadius</code>).',
      },
    },
    mixed: {
      title: { th: 'แท่งกับเส้น และแกนขวา', en: 'Bars with a line, and a right axis' },
      text: {
        th: 'ชุดข้อมูลใส่ <code>type: \'line\'</code> ในกราฟแท่งได้ และ <code>axis: \'right\'</code> ใช้แกนขวาที่มีสเกลของตัวเอง · <code>rightFormat</code> รูปแบบตัวเลขของแกนขวา (เช่น เปอร์เซ็นต์) · เส้นวาดทับแท่งเสมอ',
        en: 'A series can be <code>type: \'line\'</code> in a bar chart, and <code>axis: \'right\'</code> puts it on a right axis with its own scale · <code>rightFormat</code> formats that axis (percent, say) · lines are always drawn over the bars.',
      },
    },
    pie: {
      title: { th: 'วงกลมและโดนัท', en: 'Pie and doughnut' },
      text: {
        th: 'ใช้ชุดข้อมูลชุดเดียว แต่ละค่าคือหนึ่งชิ้น · โดนัทแสดงผลรวมตรงกลาง (<code>centerValue</code> / <code>centerLabel</code> เปลี่ยนได้, <code>cutout</code> ขนาดรู) · <code>showValues</code> แสดงเปอร์เซ็นต์บนชิ้นที่ใหญ่พอ · legend ด้านขวา (ขึ้นไปอยู่ใต้กราฟเมื่อจอแคบ) คลิกเพื่อซ่อนชิ้น ชิ้นที่ชี้อยู่ขยับออกมาเล็กน้อย',
        en: 'One series; each value is a slice · a doughnut shows the total in the middle (<code>centerValue</code> / <code>centerLabel</code> change it, <code>cutout</code> sizes the hole) · <code>showValues</code> writes percents on slices big enough · the legend sits on the right (under the chart on narrow screens) and hides slices; the slice under the pointer moves out a little.',
      },
    },
    radar: {
      title: { th: 'เรดาร์และจุด', en: 'Radar and scatter' },
      text: {
        th: '<code>type="radar"</code> เทียบหลายด้านในรูปใยแมงมุม · <code>type="scatter"</code> รับข้อมูลเป็น <code>{ x, y }</code> และ <code>r</code> ทำเป็นฟอง (bubble) · ชี้ที่จุดเพื่อดูค่า x และ y',
        en: '<code>type="radar"</code> compares several sides as a web · <code>type="scatter"</code> takes <code>{ x, y }</code> points, and <code>r</code> makes bubbles · point at a dot to read its x and y.',
      },
    },
    swap: {
      title: { th: 'สลับแบบกราฟ (Beta)', en: 'Switch the chart type (Beta)' },
      text: {
        th: '<code>[swap]="true"</code> เพิ่มปุ่มเลือกแบบกราฟมุมขวาบน มีเฉพาะแบบที่ข้อมูลชุดนั้นแสดงได้ (หลายชุดต่อป้าย: แท่ง เส้น พื้นที่ สตรีม เรดาร์ heatmap ความชัน ดัมเบล treemap · ชุดเดียว: เพิ่มวงกลม โดนัท กรวย หน่วย) หรือระบุเองเช่น <code>[swap]="[\'bar\', \'line\', \'area\']"</code> · เปลี่ยนแล้วกราฟเดิมจางหายขณะกราฟใหม่โตขึ้นมา · <code>(typeChange)</code> บอกแบบที่เลือก',
        en: '<code>[swap]="true"</code> adds a type switcher top right, offering only the kinds the data can be drawn as (several series per label: bar, line, area, stream, radar, heatmap, slope, dumbbell, treemap · one series: also pie, doughnut, funnel, units), or name them, <code>[swap]="[\'bar\', \'line\', \'area\']"</code> · the old chart fades out while the new one grows in · <code>(typeChange)</code> says which.',
      },
    },
    dynamic: {
      title: { th: 'เปลี่ยนแบบจากหน้าของแอป', en: 'Switching from your own page' },
      text: {
        th: 'ทำกราฟที่เปลี่ยนแบบได้ 3 ทาง: (1) ปุ่มในกราฟเอง <code>[swap]="true"</code> เปลี่ยนแบบ และ <code>[looks]="true"</code> เปลี่ยนลักษณะ (ใช้ในทุกตัวอย่างของหน้านี้) · (2) ปุ่มหรือเมนูของแอปเองผูกกับ <code>[type]</code> / <code>[variant]</code> แบบด้านล่าง กราฟเปลี่ยนแบบพร้อม animation เหมือนปุ่มในกราฟ · (3) <code>(typeChange)</code> / <code>(variantChange)</code> บอกสิ่งที่ผู้ใช้เลือก เก็บไว้ (เช่นใน localStorage) แล้วส่งกลับเข้า <code>[type]</code> ครั้งต่อไป',
        en: 'Three ways to a chart that switches: (1) its own buttons, <code>[swap]="true"</code> for the kind and <code>[looks]="true"</code> for the look (every sample on this page uses them) · (2) your page’s own buttons or menus bound to <code>[type]</code> / <code>[variant]</code>, as below; the chart moves over with the same animation · (3) <code>(typeChange)</code> / <code>(variantChange)</code> say what people picked: keep it (localStorage, say) and pass it back to <code>[type]</code> next time.',
      },
    },
    stream: {
      title: { th: 'สตรีม', en: 'Stream' },
      text: {
        th: '<code>type="stream"</code> พื้นที่ซ้อนกันรอบเส้นกลาง เห็นทั้งยอดรวมและแต่ละชุดที่ไหลไปตามเวลา ชื่อชุดอยู่ในช่วงที่หนาที่สุด · <code>variant</code>: <code>\'silhouette\'</code> สมมาตรรอบกลาง · <code>\'wiggle\'</code> ลดการแกว่งให้อ่านง่าย · <code>\'expand\'</code> เป็นสัดส่วน 0–100%',
        en: '<code>type="stream"</code>: stacked areas around a middle line, showing the whole and each series flowing over time; names sit where a layer is thickest · <code>variant</code>: <code>\'silhouette\'</code> even about the middle · <code>\'wiggle\'</code> least sway · <code>\'expand\'</code> shares, 0–100%.',
      },
    },
    waterfall: {
      title: { th: 'น้ำตก (waterfall)', en: 'Waterfall' },
      text: {
        th: '<code>type="waterfall"</code> แต่ละค่าคือการเปลี่ยนแปลงจากยอดก่อนหน้า ขึ้นสีเขียว ลงสีแดง ค่า <code>null</code> คือแท่งยอดรวม ณ จุดนั้น · <code>variant</code>: <code>\'bars\'</code> แท่งลอยต่อกันด้วยเส้นประ · <code>\'steps\'</code> เส้นยอดสะสมแบบขั้นบันไดบนแท่งจาง ๆ',
        en: '<code>type="waterfall"</code>: each value is a change from the running total, up in green and down in red; a <code>null</code> draws the total there · <code>variant</code>: <code>\'bars\'</code> floating bars joined by dashed lines · <code>\'steps\'</code> the running total as steps over pale bars.',
      },
    },
    dumbbell: {
      title: { th: 'ดัมเบล (ก่อน–หลัง)', en: 'Dumbbell (before and after)' },
      text: {
        th: '<code>type="dumbbell"</code> สองชุดแรกคือค่าเริ่มและค่าจบของแต่ละแถว · <code>variant</code>: <code>\'dots\'</code> เส้นไล่สีจากชุดแรกไปชุดสอง · <code>\'arrow\'</code> ลูกศรเขียวเมื่อเพิ่ม แดงเมื่อลด · <code>\'range\'</code> แถบช่วงจาง ๆ · tooltip บอกส่วนต่าง',
        en: '<code>type="dumbbell"</code>: the first two series are where each row starts and ends · <code>variant</code>: <code>\'dots\'</code> a line fading from the first colour to the second · <code>\'arrow\'</code> green when it went up, red when down · <code>\'range\'</code> a pale range bar · the tooltip gives the difference.',
      },
    },
    timeline: {
      title: { th: 'ไทม์ไลน์ (Gantt)', en: 'Timeline (Gantt)' },
      text: {
        th: '<code>type="timeline"</code> ข้อมูลเป็น <code>{ row, start, end, name?, color? }</code> (วันที่ ข้อความ ISO หรือตัวเลข) แกนเวลาเลือกช่วงวัน สัปดาห์ หรือเดือนให้เอง (ภาษาไทยเป็นปี พ.ศ.) งานที่ซ้อนกันในแถวเดียวแยกเป็นช่องย่อย · <code>variant</code>: <code>\'bars\'</code> ชื่ออยู่ในแท่ง · <code>\'thin\'</code> แท่งบางหัวท้ายกลม ชื่ออยู่ด้านบน',
        en: '<code>type="timeline"</code>: data are <code>{ row, start, end, name?, color? }</code> (dates, ISO text or numbers); the time axis picks days, weeks or months (Thai years in Thai), and work that overlaps on a row takes lanes · <code>variant</code>: <code>\'bars\'</code> names inside · <code>\'thin\'</code> slim bars with round ends, names above.',
      },
    },
    funnel: {
      title: { th: 'กรวย (funnel)', en: 'Funnel' },
      text: {
        th: '<code>type="funnel"</code> ขั้นที่เล็กลงเรื่อย ๆ ในแต่ละขั้นมีค่าและสัดส่วนจากขั้นแรก tooltip บอกสัดส่วนจากขั้นก่อน · <code>variant</code>: <code>\'funnel\'</code> ขอบโค้งต่อกัน · <code>\'bars\'</code> แท่งกลางพร้อม % ที่เหลือระหว่างขั้น · <code>\'pyramid\'</code> สามเหลี่ยมแบ่งตามค่า',
        en: '<code>type="funnel"</code>: stages getting smaller, each with its value and its share of the first; the tooltip adds the share of the previous one · <code>variant</code>: <code>\'funnel\'</code> smooth joined sides · <code>\'bars\'</code> centred bars with the share kept between them · <code>\'pyramid\'</code> a triangle cut by value.',
      },
    },
    boxplot: {
      title: { th: 'Box plot', en: 'Box plot' },
      text: {
        th: '<code>type="boxplot"</code> การกระจายของค่าในแต่ละป้าย ส่งค่าดิบเป็น array (คำนวณควอไทล์และค่าผิดปกติให้) หรือ <code>{ min, q1, median, q3, max }</code> · <code>variant</code>: <code>\'box\'</code> กล่อง หนวด และจุดผิดปกติ · <code>\'violin\'</code> รูปทรงของการกระจาย · <code>\'points\'</code> ทุกค่าเป็นจุดบนกล่องจาง ๆ · <code>[horizontal]="true"</code> วางแนวนอน',
        en: '<code>type="boxplot"</code>: how values spread per label; pass raw values (quartiles and outliers are worked out) or <code>{ min, q1, median, q3, max }</code> · <code>variant</code>: <code>\'box\'</code> box, whiskers and outliers · <code>\'violin\'</code> the shape of the spread · <code>\'points\'</code> every value as a dot over a light box · <code>[horizontal]="true"</code> lays it across.',
      },
    },
    histogram: {
      title: { th: 'ฮิสโตแกรม', en: 'Histogram' },
      text: {
        th: '<code>type="histogram"</code> ส่งค่าดิบ แล้วนับเป็นช่วงที่ขอบเป็นเลขกลม (<code>bins</code> กำหนดจำนวนช่วง) ชุดเดียวมีเส้นค่าเฉลี่ยให้ หลายชุดซ้อนกันแบบโปร่ง · <code>variant</code>: <code>\'bars\'</code> · <code>\'density\'</code> เส้นโค้งไล่สี',
        en: '<code>type="histogram"</code>: pass raw values and they are counted into bins with round edges (<code>bins</code> sets how many); one series gets a mean line, several overlap see-through · <code>variant</code>: <code>\'bars\'</code> · <code>\'density\'</code> a smooth fading curve.',
      },
    },
    sunburst: {
      title: { th: 'ซันเบิร์สต์และไอซิเคิล', en: 'Sunburst and icicle' },
      text: {
        th: '<code>type="sunburst"</code> ข้อมูลเป็นลำดับชั้น <code>{ name, value?, children? }</code> วงในคือชั้นบน คลิกชิ้นที่มีลูกเพื่อเจาะลงไป คลิกตรงกลาง (หรือ Esc) เพื่อย้อนกลับ ตรงกลางบอกชิ้นที่ชี้อยู่ · <code>variant</code>: <code>\'sunburst\'</code> · <code>\'icicle\'</code> เป็นคอลัมน์ซ้อนจากซ้ายไปขวา · <code>startAngle</code> / <code>endAngle</code> ทำครึ่งวงได้',
        en: '<code>type="sunburst"</code>: a hierarchy of <code>{ name, value?, children? }</code>, the top level innermost; click a node with children to go in, the middle (or Esc) to come back out; the middle shows the node pointed at · <code>variant</code>: <code>\'sunburst\'</code> · <code>\'icicle\'</code> stacked columns from left to right · <code>startAngle</code> / <code>endAngle</code> make a half one.',
      },
    },
    unit: {
      title: { th: 'หน่วย (waffle / รูปคน)', en: 'Units (waffle, people)' },
      text: {
        th: '<code>type="unit"</code> สัดส่วนเป็นจำนวนหน่วยที่นับได้ ปัดเศษให้รวมครบพอดี · <code>variant</code>: <code>\'waffle\'</code> 100 ช่อง ช่องละ 1% · <code>\'dots\'</code> เป็นจุด · <code>\'people\'</code> 50 รูปคน รูปละ 2% · ชี้ที่หมวดใดหมวดนั้นเด่นขึ้น',
        en: '<code>type="unit"</code>: shares as units you can count, rounded so they add up exactly · <code>variant</code>: <code>\'waffle\'</code> 100 squares, 1% each · <code>\'dots\'</code> as dots · <code>\'people\'</code> 50 figures, 2% each · pointing at a group lifts it.',
      },
    },
    slope: {
      title: { th: 'ความชัน (slope)', en: 'Slope' },
      text: {
        th: '<code>type="slope"</code> แต่ละชุดเป็นเส้นจากป้ายแรกไปป้ายสุดท้าย (มักเป็นก่อน–หลัง) ชื่อและค่าอยู่ข้างปลายเส้นโดยไม่ทับกัน · <code>variant</code>: <code>\'lines\'</code> สีตามชุด · <code>\'highlight\'</code> เพิ่มขึ้นสีเขียว ลดลงสีแดง เท่าเดิมสีเทา',
        en: '<code>type="slope"</code>: each series is a line from the first label to the last (often before and after), names and values beside the ends without overlapping · <code>variant</code>: <code>\'lines\'</code> in the series’ colours · <code>\'highlight\'</code> up green, down red, no change grey.',
      },
    },
    curves: {
      title: { th: 'พื้นที่ไล่สีและเส้นขั้นบันได', en: 'Fading areas and step lines' },
      text: {
        th: 'พื้นที่ใต้เส้นไล่สีจางลงด้านล่างให้เอง (<code>[gradient]="false"</code> เป็นสีเรียบ) · <code>curve</code>: <code>\'straight\'</code>, <code>\'smooth\'</code> หรือ <code>\'step\'</code> เส้นขั้นบันไดสำหรับค่าที่เปลี่ยนเป็นช่วง ๆ เช่นราคาหรืออัตรา (ใส่ในแต่ละชุดได้)',
        en: 'Areas fade down from the line’s colour on their own (<code>[gradient]="false"</code> fills them flat) · <code>curve</code>: <code>\'straight\'</code>, <code>\'smooth\'</code> or <code>\'step\'</code>, steps for values that change in jumps such as prices or rates (per series too).',
      },
    },
    gauge: {
      title: { th: 'วงแหวนความคืบหน้าและเกจ', en: 'Radial bars and gauges' },
      text: {
        th: '<code>type="radialBar"</code> หนึ่งวงต่อหนึ่งป้าย ค่าคือส่วนของ <code>max</code> (ค่าเริ่มต้น 100 ใส่เป็นเปอร์เซ็นต์ได้เลย) ตรงกลางแสดงวงที่ชี้อยู่ · <code>startAngle</code> / <code>endAngle</code> (องศาตามเข็มนาฬิกาจาก 12 นาฬิกา) ทำเป็นครึ่งวงกลมแบบเกจ ใช้กับโดนัทและวงกลมได้ด้วย',
        en: '<code>type="radialBar"</code> draws a ring per label, each value out of <code>max</code> (default 100, so percents read as they are); the middle shows the ring under the pointer · <code>startAngle</code> / <code>endAngle</code> (degrees clockwise from 12 o’clock) make a half circle gauge, and work for doughnuts and pies too.',
      },
    },
    polar: {
      title: { th: 'วงกลมแบบรัศมี', en: 'Polar area' },
      text: {
        th: '<code>type="polarArea"</code> ทุกชิ้นกว้างเท่ากัน ความยาวรัศมีบอกค่า มีวงบอกระดับ ใช้เทียบหลายหมวดที่ค่าห่างกันมาก',
        en: '<code>type="polarArea"</code>: every slice is as wide as the others and its length shows the value, with rings for the scale; good for comparing categories of very different sizes.',
      },
    },
    heatmap: {
      title: 'Heatmap',
      text: {
        th: '<code>type="heatmap"</code> ตารางสี: ชุดข้อมูลหนึ่งชุดคือหนึ่งแถว ป้ายคือคอลัมน์ ค่ามากสีเข้ม ตัวเลขอยู่ในช่องเมื่อมีที่พอ · <code>variant</code>: <code>\'square\'</code> · <code>\'circle\'</code> วงกลมโตตามค่า · <code>\'hex\'</code> รังผึ้ง · <code>[colorRanges]="[{ from, to, color, name }]"</code> ให้สีตามช่วงค่า และ legend แสดง / ซ่อนแต่ละช่วงได้',
        en: '<code>type="heatmap"</code>: a grid of colour, a row per series and a column per label, darker for more, the numbers inside where they fit · <code>variant</code>: <code>\'square\'</code> · <code>\'circle\'</code> circles sized by value · <code>\'hex\'</code> a honeycomb · <code>[colorRanges]="[{ from, to, color, name }]"</code> colours by range instead, and the legend shows and hides each range.',
      },
    },
    treemap: {
      title: 'Treemap',
      text: {
        th: '<code>type="treemap"</code> กล่องขนาดตามค่า เห็นสัดส่วนของหลายรายการพร้อมกัน ชื่อและค่าอยู่ในกล่องเมื่อมีที่พอ · หลายชุดข้อมูลจัดเป็นกลุ่มตามชุด สีเดียวกันในกลุ่ม',
        en: '<code>type="treemap"</code>: boxes sized by value, to see the shares of many items at once; names and values sit inside where they fit · several series group into a block each, in the series’ colour.',
      },
    },
    sparkline: {
      title: { th: 'กราฟจิ๋ว (sparkline)', en: 'Sparklines' },
      text: {
        th: '<code>[sparkline]="true"</code> ไม่มีแกน เส้นตาราง หรือ legend เส้นเต็มกล่อง สูง 48px ใช้วางข้างตัวเลขในการ์ดสรุป tooltip ยังใช้ได้',
        en: '<code>[sparkline]="true"</code>: no axes, grid or legend, the line filling a 48px box; made to sit beside a number in a summary card. The tooltip still works.',
      },
    },
    annotations: {
      title: { th: 'คำอธิบายบนกราฟ', en: 'Annotations' },
      text: {
        th: '<code>[annotations]</code>: <code>y</code> เส้นหรือแถบ (<code>to</code>) ที่ค่าหนึ่ง · <code>x</code> เส้นหรือแถบที่ป้าย (ชื่อป้ายหรือลำดับ) · <code>points</code> จุดที่มีป้ายชื่อ · แกนรวมค่าเหล่านี้ให้เห็นเสมอ',
        en: '<code>[annotations]</code>: <code>y</code> lines or bands (<code>to</code>) at values · <code>x</code> lines or bands at labels (by text or index) · <code>points</code> marked points with a label · the axis always takes these values in.',
      },
    },
    toolbar: {
      title: { th: 'แถบเครื่องมือ ซูม และดาวน์โหลด', en: 'Toolbar, zoom and download' },
      text: {
        th: '<code>[toolbar]="true"</code> ปุ่มมุมขวาบน: ซูมเข้า / ออก / ดูทั้งหมด และดาวน์โหลด PNG, SVG หรือ CSV (เปิดใน Excel ภาษาไทยไม่เพี้ยน) · ลากบนกราฟแท่ง เส้น หรือพื้นที่เพื่อซูมไปช่วงนั้น (<code>[zoom]</code> เปิด / ปิดแยกได้) · <code>(zoomChange)</code> บอกช่วงที่ซูม',
        en: '<code>[toolbar]="true"</code> adds buttons top right: zoom in / out / show all, and download as PNG, SVG or CSV (Excel opens it with Thai intact) · drag across a bar, line or area chart to zoom into those labels (<code>[zoom]</code> turns this on or off by itself) · <code>(zoomChange)</code> says where.',
      },
    },
    sync: {
      title: { th: 'กราฟที่ชี้ไปด้วยกัน', en: 'Synced charts' },
      text: {
        th: 'กราฟที่ใส่ <code>group</code> เดียวกันแสดง tooltip ที่ป้ายเดียวกันพร้อมกัน ชี้กราฟหนึ่งแล้วกราฟอื่นในกลุ่มตาม เหมาะกับแดชบอร์ดที่วางหลายกราฟตามเดือนเดียวกัน',
        en: 'Charts with the same <code>group</code> show the tooltip at the same label together: point at one and the others follow. Made for dashboards with several charts over the same months.',
      },
    },
    format: {
      title: { th: 'ตัวเลขและฟอนต์', en: 'Numbers and fonts' },
      text: {
        th: '<code>format</code>: <code>\'number\'</code> 1,234.5 · <code>\'integer\'</code> · <code>\'percent\'</code> (0.12 → 12%) · <code>\'currency\'</code> ฿1,234 (<code>currency</code> เปลี่ยนสกุลเงิน) · <code>\'compact\'</code> 1.2 พัน / 2.5 แสน / 98.8 ล้าน (ภาษาอังกฤษเป็น 1.2K / 98.8M) หรือฟังก์ชันของแอปเอง · <code>decimals</code>, <code>prefix</code>, <code>suffix</code> · <code>font</code> และ <code>fontSize</code> เปลี่ยนฟอนต์ของทั้งกราฟได้ทันที (ค่าเริ่มต้นคือฟอนต์ของธีม) · ภาษาของตัวเลขตามแอป หรือกำหนดด้วย <code>lang</code>',
        en: '<code>format</code>: <code>\'number\'</code> 1,234.5 · <code>\'integer\'</code> · <code>\'percent\'</code> (0.12 → 12%) · <code>\'currency\'</code> ฿1,234 (<code>currency</code> picks another) · <code>\'compact\'</code> 1.2 พัน / 2.5 แสน / 98.8 ล้าน (1.2K / 98.8M in English), or a function of your own · <code>decimals</code>, <code>prefix</code>, <code>suffix</code> · <code>font</code> and <code>fontSize</code> change the whole chart’s font at once (the theme’s font by default) · numbers follow the app’s language, or <code>lang</code>.',
      },
    },
    extras: {
      title: { th: 'เส้นอ้างอิง ชื่อแกน และหัวเรื่อง', en: 'Reference lines, axis titles and a heading' },
      text: {
        th: '<code>[referenceLines]="[{ value: 400, label: \'เป้าหมาย\' }]"</code> เส้นประที่ค่าหนึ่ง (แกนรวมค่านี้ให้เห็นเสมอ) · <code>xTitle</code>, <code>yTitle</code>, <code>y2Title</code> ชื่อแกน · <code>title</code> และ <code>subtitle</code> หัวเรื่องเหนือกราฟ (เป็นชื่อของกราฟสำหรับโปรแกรมอ่านจอด้วย) · <code>min</code>, <code>max</code>, <code>beginAtZero</code> กำหนดช่วงแกน',
        en: '<code>[referenceLines]="[{ value: 400, label: \'Target\' }]"</code> draws a dashed line at a value (the axis always takes it in) · <code>xTitle</code>, <code>yTitle</code>, <code>y2Title</code> name the axes · <code>title</code> and <code>subtitle</code> head the chart (the title is also its name for screen readers) · <code>min</code>, <code>max</code>, <code>beginAtZero</code> set the axis.',
      },
    },
    live: {
      title: { th: 'ข้อมูลที่เปลี่ยน และเหตุการณ์', en: 'Changing data and events' },
      text: {
        th: 'ส่ง array ใหม่เข้า <code>[series]</code> แล้วแท่งและเส้นเคลื่อนจากค่าเดิมไปค่าใหม่ แกนปรับตาม (<code>[animate]="false"</code> ปิด; ผู้ที่ขอให้ลดการเคลื่อนไหวได้แบบนิ่งเอง) · <code>(pointClick)</code> ส่ง <code>{ series, seriesName, index, label, value }</code> เมื่อคลิกหรือกด Enter · <code>(seriesToggle)</code> เมื่อ legend ซ่อน / แสดง',
        en: 'Pass a new array to <code>[series]</code> and the bars and lines move from the old values to the new, the axis following (<code>[animate]="false"</code> turns it off; people who ask for less motion get it still) · <code>(pointClick)</code> sends <code>{ series, seriesName, index, label, value }</code> on a click or Enter · <code>(seriesToggle)</code> when the legend hides or shows one.',
      },
    },
    chartjs: {
      title: { th: 'ย้ายจาก ChartJS', en: 'Moving from ChartJS' },
      text: {
        th: '<code>[data]</code> แบบ Chart.js (<code>{ labels, datasets }</code>) ใช้ได้เลย: <code>label</code>, <code>data</code>, <code>backgroundColor</code> / <code>borderColor</code> (สีเดียวหรือสีละชิ้น), <code>type</code>, <code>yAxisID</code>, <code>stack</code>, <code>hidden</code>, <code>tension</code>, <code>fill</code>, <code>borderDash</code> · <code>[options]</code> ส่วนที่เข้าใจ: <code>indexAxis: \'y\'</code>, <code>scales.*.stacked</code>, <code>scales.y.min / max / beginAtZero</code>, <code>plugins.legend</code>, <code>plugins.title</code>, <code>cutout</code> · จึงเปลี่ยนแค่ tag จาก <code>wu-chartjs</code> (หรือ <code>p-chart</code> เดิม) เป็น <code>wu-chart</code> แล้วถอด chart.js ออกได้ · ถ้าต้องใช้ปลั๊กอินหรือกราฟแบบที่ไม่มีที่นี่ ใช้ <code>wu-chartjs</code> ต่อได้ในแอปเดียวกัน',
        en: 'Chart.js-shaped <code>[data]</code> (<code>{ labels, datasets }</code>) works as it is: <code>label</code>, <code>data</code>, <code>backgroundColor</code> / <code>borderColor</code> (one colour or one per slice), <code>type</code>, <code>yAxisID</code>, <code>stack</code>, <code>hidden</code>, <code>tension</code>, <code>fill</code>, <code>borderDash</code> · the <code>[options]</code> it understands: <code>indexAxis: \'y\'</code>, <code>scales.*.stacked</code>, <code>scales.y.min / max / beginAtZero</code>, <code>plugins.legend</code>, <code>plugins.title</code>, <code>cutout</code> · so changing the tag from <code>wu-chartjs</code> (or the old <code>p-chart</code>) to <code>wu-chart</code> lets chart.js go · for plugins or chart kinds missing here, keep <code>wu-chartjs</code> in the same app.',
      },
    },
    export: {
      title: { th: 'บันทึกเป็นรูป', en: 'Save as a picture' },
      text: {
        th: '<code>#c="wuChart"</code> แล้ว <code>c.download(\'รายงาน\')</code> บันทึกเป็น PNG (<code>\'svg\'</code> เป็น SVG) · <code>c.toPNG(scale)</code> คืน data URL, <code>c.toSVG()</code> คืนข้อความ SVG ที่ใส่สีและฟอนต์ไว้ในตัว (แนบอีเมล ใส่รายงาน PDF) · รูปใช้ฟอนต์ที่ติดตั้งในเครื่อง ไม่ใช่ web font',
        en: '<code>#c="wuChart"</code>, then <code>c.download(\'report\')</code> saves a PNG (<code>\'svg\'</code> for SVG) · <code>c.toPNG(scale)</code> returns a data URL and <code>c.toSVG()</code> SVG text with the colours and fonts written in (for e-mail, PDF reports) · pictures use fonts installed on the machine, not web fonts.',
      },
    },
    a11y: {
      title: { th: 'คีย์บอร์ดและโปรแกรมอ่านจอ', en: 'Keyboard and screen readers' },
      text: {
        th: 'กราฟกด Tab เข้าได้ · <code>←</code> <code>→</code> (แท่งแนวนอนใช้ <code>↑</code> <code>↓</code>) เลื่อนทีละป้ายพร้อม tooltip และอ่านค่าออกเสียง · <code>Home</code> / <code>End</code> · <code>Enter</code> ส่ง <code>(pointClick)</code> · <code>Esc</code> ปิด tooltip · มีตารางข้อมูลซ่อนไว้ให้โปรแกรมอ่านจอ และ legend เป็นปุ่มที่บอกสถานะ (aria-pressed)',
        en: 'The chart takes Tab · <code>←</code> <code>→</code> (<code>↑</code> <code>↓</code> for bars across) move label by label with the tooltip, read aloud · <code>Home</code> / <code>End</code> · <code>Enter</code> sends <code>(pointClick)</code> · <code>Esc</code> closes the tooltip · a hidden data table gives screen readers the numbers, and the legend items are buttons that say their state (aria-pressed).',
      },
    },
  },
  code: {
    import: `import { WuChart } from 'wiraui/chart';`,
    basic: `<wu-chart type="bar" [labels]="months" [series]="money" format="currency"></wu-chart>`,
    line: `<wu-chart type="line" [labels]="months" [series]="visitors" [smooth]="true" format="compact"></wu-chart>
<wu-chart type="area" [labels]="months" [series]="money" [stacked]="true" format="compact"></wu-chart>`,
    bars: `<wu-chart type="bar" [labels]="grades" [series]="students" [stacked]="true" [showValues]="true"></wu-chart>
<wu-chart type="bar" [labels]="channels" [series]="applicants" [horizontal]="true" [showValues]="true" height="260"></wu-chart>`,
    mixed: `<wu-chart type="bar" [labels]="months" [series]="salesAndGrowth" format="compact" rightFormat="percent"
  yTitle="ยอดขาย" y2Title="อัตราเติบโต"></wu-chart>`,
    pie: `<wu-chart type="doughnut" [labels]="channels" [series]="applicants" [showValues]="true" suffix=" คน"></wu-chart>
<wu-chart type="pie" [labels]="channels" [series]="applicants" legend="bottom"></wu-chart>`,
    radar: `<wu-chart type="radar" [labels]="skills" [series]="skillScores" [max]="5"></wu-chart>
<wu-chart type="scatter" [series]="readingVsScore" xTitle="ชั่วโมงอ่านหนังสือ" yTitle="คะแนนสอบ"></wu-chart>`,
    curves: `<wu-chart type="area" [labels]="months" [series]="money" format="compact"></wu-chart>
<wu-chart type="line" [labels]="years" [series]="tuition" curve="step" format="currency"></wu-chart>`,
    gauge: `<wu-chart type="radialBar" [labels]="['การเข้าเรียนวันนี้']" [series]="[{ data: [87] }]" [startAngle]="-90" [endAngle]="90"></wu-chart>
<wu-chart type="radialBar" [labels]="['ส่งงาน', 'เข้าเรียน', 'กิจกรรม']" [series]="[{ data: [76, 92, 58] }]" legend="bottom"></wu-chart>`,
    polar: `<wu-chart type="polarArea" [labels]="channels" [series]="applicants"></wu-chart>
<wu-chart type="doughnut" [labels]="channels" [series]="applicants" [startAngle]="-90" [endAngle]="90" legend="bottom"></wu-chart>`,
    swap: `<wu-chart type="bar" [labels]="months" [series]="money" [swap]="true" format="compact" (typeChange)="kind = $event"></wu-chart>
<wu-chart type="doughnut" [labels]="channels" [series]="applicants" [swap]="true"></wu-chart>`,
    dynamic: `<wu-selectbutton [options]="kinds" optionLabel="label" optionValue="value" [(ngModel)]="kind"></wu-selectbutton>
<wu-chart [type]="kind" [labels]="months" [series]="money" format="compact"></wu-chart>`,
    stream: `<wu-chart type="stream" [labels]="months" [series]="clubs" variant="silhouette" [looks]="true"></wu-chart>`,
    waterfall: `<wu-chart type="waterfall" [labels]="budgetSteps" [series]="budgetFlow" format="compact" variant="bars" [looks]="true"></wu-chart>`,
    dumbbell: `<wu-chart type="dumbbell" [labels]="subjects" [series]="beforeAfter" variant="dots" [looks]="true" height="300"></wu-chart>`,
    timeline: `<wu-chart type="timeline" [series]="project" variant="bars" [looks]="true" height="300"></wu-chart>`,
    funnel: `<wu-chart type="funnel" [labels]="steps" [series]="admissions" variant="funnel" [looks]="true" height="320"></wu-chart>`,
    boxplot: `<wu-chart type="boxplot" [labels]="classes" [series]="scores" variant="box" [looks]="true" yTitle="คะแนน"></wu-chart>`,
    histogram: `<wu-chart type="histogram" [series]="heights" variant="bars" [looks]="true" xTitle="ส่วนสูง (ซม.)"></wu-chart>`,
    sunburst: `<wu-chart type="sunburst" [series]="budget" variant="sunburst" [looks]="true" format="compact" height="360"></wu-chart>`,
    unit: `<wu-chart type="unit" [labels]="travel" [series]="travelCounts" variant="waffle" [looks]="true" height="300"></wu-chart>`,
    slope: `<wu-chart type="slope" [labels]="['2568', '2569']" [series]="yearScores" variant="lines" [looks]="true" height="320"></wu-chart>`,
    heatmap: `<wu-chart type="heatmap" [labels]="days" [series]="library" variant="square" [looks]="true" height="260"></wu-chart>
<wu-chart type="heatmap" [labels]="days" [series]="library" [colorRanges]="ranges" height="260"></wu-chart>`,
    treemap: `<wu-chart type="treemap" [labels]="departments" [series]="budgets" format="compact" height="340"></wu-chart>`,
    sparkline: `<div class="kpis">
  <div class="kpi">
    <span>ผู้เข้าชม</span>
    <strong>30,400</strong>
    <wu-chart type="area" [labels]="months" [series]="visitors.slice(0, 1)" [sparkline]="true"></wu-chart>
  </div>
  <!-- … -->
</div>`,
    annotations: `<wu-chart type="line" [labels]="months" [series]="visitors.slice(0, 1)" [annotations]="notes" format="compact"></wu-chart>`,
    toolbar: `<wu-chart
  type="area"
  [labels]="days30"
  [series]="daily"
  [toolbar]="true"
  fileName="visitors"
  (zoomChange)="zoomed = $event"
></wu-chart>`,
    sync: `<wu-chart group="school" type="line" [labels]="months" [series]="visitors.slice(0, 1)" height="200"></wu-chart>
<wu-chart group="school" type="bar" [labels]="months" [series]="money" format="compact" height="200"></wu-chart>`,
    format: `<wu-chart type="bar" [labels]="months" [series]="money" format="compact" font="Sarabun" [fontSize]="14"></wu-chart>
<wu-chart type="line" [labels]="months" [series]="visitors" format="number" suffix=" คน" [decimals]="0"></wu-chart>`,
    extras: `<wu-chart
  type="line"
  title="รายรับรายจ่าย ภาคเรียนที่ 2/2569"
  subtitle="หน่วย: บาท"
  [labels]="months"
  [series]="money"
  [referenceLines]="[{ value: 400000, label: 'งบประมาณ' }]"
  format="compact"
  yTitle="บาท"
></wu-chart>`,
    live: `<wu-button label="สุ่มข้อมูลใหม่" icon="wi wi-refresh" (onClick)="shuffle()"></wu-button>
<wu-chart type="bar" [labels]="months" [series]="live" (pointClick)="clicked($event)"></wu-chart>
<p>คลิกล่าสุด: {{ lastClick }}</p>`,
    chartjs: `<!-- เดิม: <wu-chartjs type="bar" [data]="data" [options]="options"> -->
<wu-chart type="bar" [data]="data" [options]="options"></wu-chart>`,
    export: `<wu-chart #c="wuChart" type="doughnut" [labels]="channels" [series]="applicants"></wu-chart>
<wu-button label="ดาวน์โหลด PNG" icon="wi wi-download" (onClick)="c.download('applicants')"></wu-button>
<wu-button label="ดาวน์โหลด SVG" severity="secondary" [outlined]="true" (onClick)="c.download('applicants', 'svg')"></wu-button>`,
  },
  ts: {
    basic: `import { WuChartSeries } from 'wiraui/chart';

months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];
money: WuChartSeries[] = [
  { name: 'รายรับ', data: [420000, 380000, 510000, 465000, 530000, 610000] },
  { name: 'รายจ่าย', data: [310000, 295000, 340000, 360000, 330000, 390000] },
];`,
    line: `visitors: WuChartSeries[] = [
  { name: 'ผู้เข้าชม', data: [12500, 18200, 15800, 24100, 21900, 30400] },
  { name: 'สมัครเรียน', data: [820, 1340, 1210, 2050, 1890, 2610], smooth: false, dashed: true },
];`,
    bars: `grades = ['ม.1', 'ม.2', 'ม.3'];
students: WuChartSeries[] = [
  { name: 'ชาย', data: [132, 120, 115] },
  { name: 'หญิง', data: [128, 135, 124] },
];
channels = ['เพื่อน / ครอบครัว', 'โซเชียลมีเดีย', 'เว็บไซต์', 'ป้ายประกาศ', 'อื่น ๆ'];
applicants: WuChartSeries[] = [{ name: 'ผู้สมัคร', data: [420, 365, 210, 95, 40] }];`,
    mixed: `salesAndGrowth: WuChartSeries[] = [
  { name: 'ยอดขาย', data: [1200000, 1350000, 1280000, 1520000, 1610000, 1790000] },
  { name: 'อัตราเติบโต', type: 'line', axis: 'right', data: [0.04, 0.125, -0.052, 0.188, 0.059, 0.112] },
];`,
    radar: `skills = ['ฟัง', 'พูด', 'อ่าน', 'เขียน', 'คิดวิเคราะห์'];
skillScores: WuChartSeries[] = [
  { name: 'ห้อง ม.1/1', data: [4.2, 3.6, 4.5, 3.1, 3.9] },
  { name: 'ค่าเฉลี่ยระดับชั้น', data: [3.8, 3.4, 3.9, 3.3, 3.5], dashed: true },
];
readingVsScore: WuChartSeries[] = [
  { name: 'นักเรียน', data: [{ x: 2, y: 54 }, { x: 4, y: 61 }, { x: 5, y: 66, r: 9 } /* … */] },
];`,
    live: `import { WuChartClickEvent, WuChartSeries } from 'wiraui/chart';

live: WuChartSeries[] = [{ name: 'ผู้เข้าชม', data: this.random() }];
lastClick = '-';

shuffle(): void {
  this.live = [{ name: 'ผู้เข้าชม', data: this.random() }];   // a new array: the chart moves to it
}

clicked(e: WuChartClickEvent): void {
  this.lastClick = \`\${e.label}: \${e.value}\`;
}

private random(): number[] {
  return this.months.map(() => Math.round(200 + Math.random() * 800));
}`,
    curves: `years = ['2564', '2565', '2566', '2567', '2568', '2569'];
tuition: WuChartSeries[] = [{ name: 'ค่าเทอม', data: [12000, 12000, 13500, 13500, 15000, 15000] }];`,
    heatmap: `import { WuChartColorRange, WuChartSeries } from 'wiraui/chart';

days = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.'];
library: WuChartSeries[] = [
  { name: '08:00', data: [12, 18, 9, 22, 14] },
  { name: '10:00', data: [35, 41, 28, 39, 30] },
  { name: '12:00', data: [58, 64, 49, 61, 70] },
  { name: '14:00', data: [27, 33, 25, 38, 21] },
  { name: '16:00', data: [44, 19, 52, 17, 8] },
];
ranges: WuChartColorRange[] = [
  { from: 0, to: 20, color: '#22c55e', name: 'ว่าง' },
  { from: 21, to: 45, color: '#f59e0b', name: 'ปานกลาง' },
  { from: 46, to: 100, color: '#ef4444', name: 'แน่น' },
];`,
    dynamic: `import { WuChartType } from 'wiraui/chart';

kind: WuChartType = 'bar';
kinds = [
  { label: 'แท่ง', value: 'bar' },
  { label: 'เส้น', value: 'line' },
  { label: 'พื้นที่', value: 'area' },
  { label: 'สตรีม', value: 'stream' },
  { label: 'ตารางสี', value: 'heatmap' },
];`,
    stream: `clubs: WuChartSeries[] = [
  { name: 'ชมรมดนตรี', data: [30, 42, 38, 55, 48, 62] },
  { name: 'ชมรมกีฬา', data: [45, 40, 52, 48, 60, 58] },
  { name: 'ชมรมศิลปะ', data: [20, 28, 35, 30, 26, 40] },
  { name: 'ชมรมวิทย์', data: [15, 18, 22, 30, 36, 33] },
];`,
    waterfall: `budgetSteps = ['งบต้นปี', 'ค่าเทอม', 'เงินบริจาค', 'ค่าสาธารณูปโภค', 'ค่ากิจกรรม', 'ซ่อมอาคาร', 'คงเหลือ'];
// A change per step; null draws the total there.
budgetFlow: WuChartSeries[] = [{ data: [500000, 320000, 85000, -140000, -210000, -180000, null] }];`,
    dumbbell: `subjects = ['คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาไทย', 'ภาษาอังกฤษ', 'สังคมศึกษา'];
beforeAfter: WuChartSeries[] = [
  { name: 'ก่อนเรียน', data: [42, 48, 61, 39, 55] },
  { name: 'หลังเรียน', data: [68, 71, 66, 58, 52] },
];`,
    timeline: `project: WuChartSeries[] = [
  {
    name: 'โครงการ',
    data: [
      { row: 'วางแผน', start: '2026-05-01', end: '2026-05-10', name: 'เก็บความต้องการ' },
      { row: 'ออกแบบ', start: '2026-05-08', end: '2026-05-24', name: 'ออกแบบหน้าจอ' },
      { row: 'ออกแบบ', start: '2026-05-20', end: '2026-05-28', name: 'ทบทวนแบบ' },
      { row: 'พัฒนา', start: '2026-05-22', end: '2026-06-25', name: 'เขียนโค้ด' },
      // …
    ],
  },
];`,
    funnel: `steps = ['เข้าชมเว็บไซต์', 'ดูหลักสูตร', 'กรอกใบสมัคร', 'ส่งเอกสาร', 'ชำระเงิน'];
admissions: WuChartSeries[] = [{ data: [12000, 6400, 2100, 1450, 980] }];`,
    boxplot: `classes = ['ม.4/1', 'ม.4/2', 'ม.4/3', 'ม.4/4'];
// Raw scores per class: quartiles, whiskers and outliers are worked out.
scores: WuChartSeries[] = [{ name: 'คะแนน', data: [[55, 62, 71, 48, /* … */], /* … */] }];`,
    histogram: `// 200 raw values, counted into bins.
heights: WuChartSeries[] = [{ name: 'ส่วนสูง', data: [158.2, 163.9, 151.4, /* … */] }];`,
    sunburst: `import { WuChartNode, WuChartSeries } from 'wiraui/chart';

budgetTree: WuChartNode[] = [
  {
    name: 'วิชาการ',
    children: [
      { name: 'คณิต', value: 900000 },
      { name: 'วิทย์', children: [{ name: 'ฟิสิกส์', value: 420000 }, { name: 'เคมี', value: 380000 }, { name: 'ชีวะ', value: 300000 }] },
      { name: 'ภาษา', value: 650000 },
    ],
  },
  // …
];
budget: WuChartSeries[] = [{ name: 'งบประมาณ', data: this.budgetTree }];`,
    unit: `travel = ['เดิน', 'จักรยาน', 'รถรับส่ง', 'รถผู้ปกครอง', 'รถสาธารณะ'];
travelCounts: WuChartSeries[] = [{ name: 'การเดินทางมาโรงเรียน', data: [120, 85, 210, 340, 95] }];`,
    slope: `yearScores: WuChartSeries[] = [
  { name: 'คณิตศาสตร์', data: [52, 61] },
  { name: 'วิทยาศาสตร์', data: [58, 63] },
  { name: 'ภาษาไทย', data: [66, 64] },
  { name: 'ภาษาอังกฤษ', data: [45, 54] },
  { name: 'สังคมศึกษา', data: [60, 60] },
];`,
    treemap: `departments = ['บุคลากร', 'วิชาการ', 'อาคารสถานที่', 'กิจการนักเรียน', 'เทคโนโลยี', 'งบกลาง'];
budgets: WuChartSeries[] = [{ name: 'งบประมาณ', data: [4800000, 3200000, 2100000, 1400000, 1100000, 900000] }];`,
    annotations: `import { WuChartAnnotations } from 'wiraui/chart';

notes: WuChartAnnotations = {
  y: [{ value: 20000, to: 26000, label: 'ช่วงเป้าหมาย', color: '#16a34a' }],
  x: [{ at: 'เม.ย.', to: 'พ.ค.', label: 'ปิดภาคเรียน' }],
  points: [{ at: 'มิ.ย.', value: 30400, label: 'สูงสุด' }],
};`,
    toolbar: `days30 = Array.from({ length: 30 }, (_, i) => String(i + 1));
daily: WuChartSeries[] = [{ name: 'ผู้เข้าชมรายวัน', data: [/* 30 values */] }];
zoomed: WuChartZoomEvent | null = null;`,
    chartjs: `data = {
  labels: ['ม.ค.', 'ก.พ.', 'มี.ค.'],
  datasets: [
    { label: 'รายรับ', data: [42, 38, 51], backgroundColor: '#0f766e' },
    { label: 'รายจ่าย', data: [31, 29, 34], backgroundColor: '#f59e0b' },
  ],
};
options = { plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } };`,
  },
  css: {
    sparkline: `.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 1rem; }
.kpi { display: grid; gap: 0.25rem; padding: 1rem; border: 1px solid var(--wu-border); border-radius: var(--wu-radius-lg); }
.kpi strong { font-size: 1.5rem; }`,
  },
  api: [
    {
      id: 'api-data',
      title: { th: 'Inputs · ข้อมูล', en: 'Inputs · data' },
      rows: [
        row(
          'type',
          "'bar' | 'line' | 'area' | 'pie' | 'doughnut' | 'polarArea' | 'radialBar' | 'radar' | 'scatter' | 'heatmap' | 'treemap' | 'stream' | 'waterfall' | 'dumbbell' | 'timeline' | 'funnel' | 'boxplot' | 'histogram' | 'sunburst' | 'unit' | 'slope'",
          "'bar'",
          'แบบของกราฟ',
          'Kind of chart'
        ),
        row('variant', 'string', undefined, 'ลักษณะของแต่ละแบบ (ดูในแต่ละหัวข้อ เช่น heatmap \'hex\', funnel \'pyramid\', boxplot \'violin\')', 'The look of a kind (see each section, e.g. heatmap \'hex\', funnel \'pyramid\', boxplot \'violin\')'),
        row('swap', "boolean | WuChartType[]", undefined, '(Beta) ปุ่มสลับแบบกราฟ: true คือทุกแบบที่ข้อมูลแสดงได้', '(Beta) A type switcher: true offers every kind the data can be drawn as'),
        row('looks', BOOL, 'false', 'ปุ่มเลือกลักษณะของแบบที่มีหลายลักษณะ', 'A look picker for kinds with several looks'),
        row('bins', 'number', 'auto', 'จำนวนช่วงของฮิสโตแกรม', 'Histogram bins'),
        row('labels', 'string[]', undefined, 'ป้ายของแกน (ชิ้นของวงกลม)', 'Axis labels (pie slices)'),
        row('series', 'WuChartSeries[]', undefined, '{ name, data, type?, color?, colors?, axis?, stack?, smooth?, dashed?, fill?, hidden? }', '{ name, data, type?, color?, colors?, axis?, stack?, smooth?, dashed?, fill?, hidden? }'),
        row('data · options', 'Chart.js data · options', undefined, 'ข้อมูลแบบ Chart.js แทน labels / series', 'Chart.js-shaped data instead of labels / series'),
      ],
    },
    {
      id: 'api-look',
      title: { th: 'Inputs · หน้าตา', en: 'Inputs · look' },
      rows: [
        row('title · subtitle', 'string', undefined, 'หัวเรื่องเหนือกราฟ', 'Heading above the chart'),
        row('height', 'number | string', "'320px'", 'ความสูงของพื้นที่วาด (วงกลม 280px)', 'Height of the drawing (pie 280px)'),
        row('legend', "'top' | 'bottom' | 'right' | 'none'", "'bottom' (วงกลม 'right')", 'ตำแหน่ง legend', 'Where the legend goes'),
        row('font · fontSize', 'string · number', 'ฟอนต์ของธีม · 12', 'ฟอนต์ของทุกข้อความในกราฟ', 'Font of every text in the chart'),
        row('horizontal · stacked · smooth', BOOL, 'false', 'แท่งแนวนอน · ซ้อน · เส้นโค้ง', 'Bars across · stacked · smooth lines'),
        row('curve', "'straight' | 'smooth' | 'step'", "'straight'", 'รูปแบบเส้น (ชนะ smooth)', 'How lines go from point to point (wins over smooth)'),
        row('gradient', BOOL, 'true', 'พื้นที่ใต้เส้นไล่สีจางลง', 'Areas fade down from the line’s colour'),
        row('sparkline', BOOL, 'false', 'กราฟจิ๋ว ไม่มีแกน เส้นตาราง และ legend (สูง 48px)', 'A small chart with no axes, grid or legend (48px tall)'),
        row('startAngle · endAngle', 'number', '0 · 360', 'มุมเริ่มและจบของวงกลม โดนัท และ radial bar (-90 · 90 คือครึ่งวง)', 'Where pies, doughnuts and radial bars start and end (-90 · 90 is a half circle)'),
        row('colorRanges', '{ from, to, color, name? }[]', undefined, 'สีของ heatmap ตามช่วงค่า', 'Heatmap colours by value range'),
        row('toolbar', BOOL, 'false', 'ปุ่มซูมและดาวน์โหลด PNG / SVG / CSV', 'Zoom buttons and PNG / SVG / CSV download'),
        row('zoom', BOOL, 'toolbar', 'ลากบนกราฟเพื่อซูม (แท่ง เส้น พื้นที่)', 'Drag across to zoom (bar, line, area)'),
        row('group', 'string', undefined, 'กราฟในกลุ่มเดียวกันแสดง tooltip พร้อมกัน', 'Charts in one group show the tooltip together'),
        row('fileName', 'string', "'chart'", 'ชื่อไฟล์ที่ดาวน์โหลดจากแถบเครื่องมือ', 'Name of the toolbar’s downloads'),
        row('showValues · points · grid', BOOL, 'false · auto · true', 'ค่าบนกราฟ · จุดบนเส้น · เส้นตาราง', 'Values on the marks · dots on lines · grid lines'),
        row('colors', 'string[]', 'theme', 'สีของชุดที่ไม่ได้กำหนดสี', 'Colours for series without one'),
        row('barRadius · cutout', 'number', '4 · 0.62', 'มุมมนของแท่ง (px) · ขนาดรูโดนัท', 'Rounded bar ends (px) · doughnut hole'),
        row('centerValue · centerLabel', 'string', 'ผลรวม · รวม', 'ข้อความกลางโดนัท', 'Text in the doughnut’s middle'),
        row('tooltip · animate', BOOL, 'true', 'tooltip · การเคลื่อนไหว', 'Tooltip · animation'),
        row('emptyMessage', 'string', 'locale', 'ข้อความเมื่อไม่มีข้อมูล', 'Shown when there is no data'),
        row('ariaLabel', 'string', 'title', 'ชื่อของกราฟสำหรับโปรแกรมอ่านจอ', 'The chart’s name for screen readers'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-axes',
      title: { th: 'Inputs · แกนและตัวเลข', en: 'Inputs · axes and numbers' },
      rows: [
        row('format · rightFormat', "'number' | 'integer' | 'percent' | 'currency' | 'compact' | (v) => string", "'number'", 'รูปแบบตัวเลข (แกนซ้าย / ขวา tooltip ค่าบนกราฟ)', 'How numbers read (left / right axis, tooltip, labels)'),
        row('currency · decimals · prefix · suffix · lang', 'string · number', "'THB'", 'สกุลเงิน · ทศนิยม · ข้อความหน้า / หลัง · ภาษาของตัวเลข', 'Currency · decimals · text before / after · language of numbers'),
        row('min · max · beginAtZero', 'number · boolean', 'auto', 'ช่วงของแกนค่า', 'Value axis range'),
        row('rightMin · rightMax', 'number', 'auto', 'ช่วงของแกนขวา', 'Right axis range'),
        row('xTitle · yTitle · y2Title', 'string', undefined, 'ชื่อแกน', 'Axis titles'),
        row('referenceLines', '{ value, to?, label?, color?, axis?, dashed? }[]', undefined, 'เส้นอ้างอิงที่ค่าหนึ่ง (to: แถบ)', 'Lines at given values (to: a band)'),
        row('annotations', '{ y?, x?, points? }', undefined, 'เส้นและแถบที่ค่าหรือป้าย และจุดที่มีป้ายชื่อ', 'Lines and bands at values or labels, and labelled points'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('pointClick', 'WuChartClickEvent', undefined, '{ series, seriesName, index, label, value, originalEvent }', '{ series, seriesName, index, label, value, originalEvent }'),
        row('seriesToggle', 'WuChartToggleEvent', undefined, '{ index, name, hidden } เมื่อ legend ซ่อน / แสดง', '{ index, name, hidden } when the legend hides / shows'),
        row('zoomChange', 'WuChartZoomEvent | null', undefined, '{ from, to } ช่วงป้ายที่ซูม (null: ดูทั้งหมด)', '{ from, to } labels zoomed into (null: all)'),
        row('typeChange', 'WuChartType', undefined, 'แบบที่เลือกจากปุ่มสลับแบบกราฟ', 'The kind picked in the type switcher'),
        row('variantChange', 'string', undefined, 'ลักษณะที่เลือกจากปุ่มเลือกลักษณะ', 'The look picked in the look picker'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน #c="wuChart"', en: 'Call them through #c="wuChart".' },
      rows: [
        row("download(fileName = 'chart', 'png' | 'svg' | 'csv')", 'Promise<void>', undefined, 'บันทึกเป็นไฟล์', 'Save as a file'),
        row('toCSV()', 'string', undefined, 'ตัวเลขเป็น CSV แถวละป้าย คอลัมน์ละชุด', 'The numbers as CSV, a row per label and a column per series'),
        row('toPNG(scale = 2, background?)', 'Promise<string>', undefined, 'PNG เป็น data URL', 'PNG as a data URL'),
        row('toSVG()', 'string', undefined, 'SVG ที่ใส่สีและฟอนต์ไว้ในตัว', 'SVG with colours and fonts written in'),
        row('refresh()', 'void', undefined, 'วาดใหม่ (หลังแก้ series ในที่เดิม)', 'Draw again (after changing series in place)'),
      ],
    },
  ],
  tokens: [
    tok('--wu-chart-1 … --wu-chart-10', 'สีของชุดข้อมูลตามลำดับ (1 คือสีหลักของธีม)', 'Series colours in order (1 is the theme’s primary)'),
    tok('--wu-chart-font-family · -font-size', 'ฟอนต์และขนาดของข้อความในกราฟ', 'Font and size of the chart’s text'),
    tok('--wu-chart-text · -title-color · -title-size · -title-weight', 'สีข้อความ · หัวเรื่อง', 'Text colour · heading'),
    tok('--wu-chart-grid · -axis · -crosshair', 'เส้นตาราง · เส้นศูนย์ · เส้นตามเมาส์', 'Grid · zero line · pointer guide'),
    tok('--wu-chart-line-width · -area-opacity · -dot-fill', 'ความหนาของเส้น · ความทึบของพื้นที่ · สีในจุด', 'Line width · area opacity · dot fill'),
    tok('--wu-chart-dim-opacity', 'ความจางของชุดอื่นเมื่อชี้ที่ legend', 'How faint other series get while one is pointed at'),
    tok('--wu-chart-value-color · -value-inside-color · -slice-border', 'ค่าบนกราฟ · ค่าบนชิ้นวงกลม · ขอบชิ้น', 'Values · values on slices · slice edges'),
    tok('--wu-chart-reference-color · -center-size · -legend-color', 'เส้นอ้างอิง · ข้อความกลางโดนัท · legend', 'Reference lines · doughnut middle · legend'),
    tok('--wu-chart-tooltip-bg · -color · -border · -radius · -shadow · -padding', 'tooltip', 'Tooltip'),
    tok('--wu-chart-gradient-from · -gradient-to', 'ความทึบบนสุดและล่างสุดของพื้นที่ไล่สี', 'Opacity at the top and bottom of a fading area'),
    tok('--wu-chart-track', 'รางของ radial bar', 'Radial bar track'),
    tok('--wu-chart-band-opacity · -mark-color', 'ความทึบของแถบคำอธิบาย · สีจุดที่มีป้าย', 'Annotation band opacity · marked point colour'),
    tok('--wu-chart-selection · -toolbar-color', 'กรอบที่ลากเพื่อซูม · ปุ่มในแถบเครื่องมือ', 'Zoom selection · toolbar buttons'),
    tok('--wu-chart-up · -down · -total · -muted', 'เพิ่มขึ้น · ลดลง · ยอดรวม (waterfall, ดัมเบล, ความชัน) · เส้นต่อและข้อความรอง', 'Up · down · totals (waterfall, dumbbell, slope) · joints and quiet text'),
    tok('--wu-chart-gap', 'ระยะระหว่างหัวเรื่อง กราฟ และ legend', 'Gap between heading, chart and legend'),
  ],
};
