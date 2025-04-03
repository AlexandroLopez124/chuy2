import { FC } from 'react';
import './Footer.css';

const Footer: FC = () => {
  return (
    <footer className='footer'>
      <div className='sub-footer'>
        <span className='footer__copyright'>
          2025{' '}
          <a className='footer__link' href='https://github.com/mostafa-kheibary' target='_blank'>
            Chuy's Jerseys
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
