import { Button } from '../../components';
import { Container } from '../../Layout';
import './About.css';

const About: React.FC = () => {
  return (
    <Container>
      <div className='about'>
        <h2 className='about__title'>Chuy's Jerseys</h2>
        <h4 className='about__autur'>Aun en desarrollo</h4>
      </div>
    </Container>
  );
};

export default About;
