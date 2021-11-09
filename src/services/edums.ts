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
