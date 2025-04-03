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
      { name: 'CONCACAF', url: '/catagory/CONCACAF' },
      { name: 'UEFA', url: '/catagory/UEFA' },
      { name: 'CONMEBOL', url: '/catagory/CONMEBOL' },
      { name: 'SELECCIONES', url: '/catagory/SELECCIONES' },
    ],
  },
  { name: 'CONOCENOS', url: '/about' },
];
export default menuData;
