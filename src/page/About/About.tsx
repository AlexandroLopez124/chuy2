import { Button } from '../../components';
import { Container } from '../../Layout';
import './About.css';

const About: React.FC = () => {
  return (
    <Container>
      <div className='about'>
        <h2 className='about__title'>Chuy Jerseys</h2>
        <h4 className='about__autur'>Tienda de camisetas de clubes de futbol</h4>
        <p className='about__discription'>Bienvenido a ChuyJerseys, el destino ideal para los verdaderos fanáticos del fútbol. Encuentra las camisetas de los clubes más grandes del mundo y de las selecciones nacionales más icónicas. Desde los equipos europeos más prestigiosos hasta las selecciones que han hecho historia, tenemos todo lo que necesitas para llevar tu pasión por el fútbol a otro nivel. Calidad, autenticidad y los mejores diseños en un solo lugar. ¡Equípate como un campeón y muestra tus colores con orgullo!</p>
      </div>
    </Container>
  );
};

export default About;
