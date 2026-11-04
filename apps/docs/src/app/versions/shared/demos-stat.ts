import { DestroyRef, inject } from '@angular/core';
import { DESCRIPTIONS_DOC } from '../../data/descriptions';
import { STAT_DOC } from '../../data/stat';
import { SimpleDemo } from './demos';

/* State behind the Stat and Descriptions pages (no wiraui import, like demos.ts). */

export abstract class StatDemo extends SimpleDemo {
  protected readonly doc = STAT_DOC;
  isLoading = false;
  opened = '';
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  reload(): void {
    this.isLoading = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => (this.isLoading = false), 1200);
  }

  openList(status: string): void {
    this.opened = status;
  }
}

export abstract class DescriptionsDemo extends SimpleDemo {
  protected readonly doc = DESCRIPTIONS_DOC;
  readonly reporter = [
    { label: 'ชื่อ', value: 'วิระ มีสุข' },
    { label: 'หน่วยงาน', value: 'ฝ่ายบัญชี' },
    { label: 'โทรศัพท์ภายใน', value: '2145' },
    { label: 'อีเมล', value: 'wira@example.com' },
  ];
  readonly device = [
    { label: 'เครื่อง', value: 'โน้ตบุ๊ก NB-0417' },
    { label: 'ระบบปฏิบัติการ', value: 'Windows 11' },
    { label: 'หน่วยความจำ', value: '16 GB' },
    { label: 'ที่ตั้ง', value: 'อาคาร 2 ชั้น 3 ห้อง 305' },
    { label: 'ประกันถึง', value: '31 มี.ค. 2570' },
    { label: 'ผู้ดูแล', value: 'วิระ มีสุข' },
  ];
  readonly summary = [
    { label: 'เลขที่', value: 'HD-2569-0142' },
    { label: 'สถานะ', value: 'กำลังดำเนินการ' },
    { label: 'แจ้งเมื่อ', value: '3 พ.ย. 2569' },
    { label: 'กำหนดเสร็จ', value: '5 พ.ย. 2569' },
    { label: 'หมายเหตุ', value: 'รออะไหล่จากผู้ขาย 1 รายการ', span: 2 },
  ];
}
