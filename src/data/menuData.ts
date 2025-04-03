export interface IMenuData {
  name: string;
  url: string;
  submenu?: IMenuData[];
}
const menuData: IMenuData[] = [
  { name: 'INICIO', url: '/' },
  { name: 'COMPRAR', url: '/shop' },
  { name: 'CONOCENOS', url: '/about' },
];
export default menuData;
