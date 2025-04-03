export interface IMenuData {
  name: string;
  url: string;
  submenu?: IMenuData[];
}
const menuData: IMenuData[] = [
  { name: 'INICIO', url: '/' },
  { name: 'COMPRAR', url: '/shop' },
  {
    name: 'CATEGORIA',
    url: '/catagory',
    submenu: [
      { name: 'CONCACAF', url: '/catagory/consols' },
      { name: 'UEFA', url: '/catagory/phone' },
      { name: 'CONMEBOL', url: '/catagory/accessories' },
      { name: 'SELECCIONES', url: '/catagory/headphone' },
    ],
  },
  { name: 'CONOCENOS', url: '/about' },
];
export default menuData;
