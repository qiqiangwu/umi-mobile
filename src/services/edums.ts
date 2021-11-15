/**
 * edums service
 */

import { Get } from '@/utils/request';
/**
 * 查询学生信息
 * @param {number} id 学生id
 */
export async function getStuById({ id }: { id: number }) {
  return Get(`/EDUMS/edumsStudentInterface/getStuById?id=${id}`);
}

/**
 * 查询是否订购产品
 * @param phone 电话号码
 * @returns
 */
export async function boosCheckPhone({ phone }: { phone: string }) {
  const url = '/EDUMS/edumsStudentInterface/boosCheckphone';

  return Get(url, { phone });
}
