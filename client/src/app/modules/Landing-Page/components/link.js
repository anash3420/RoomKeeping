/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Link as A } from 'theme-ui';
import { Link as MenuLink } from 'react-scroll';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { Link as Red } from 'react-router-dom';

export function NavLink({ path, label, children,i, ...rest }) {
  return (
    <MenuLink
      to={path}
      spy={true}
      offset={-70}
      smooth={true}
      duration={500}
      className="nav-item"
      activeClass="active"
      {...rest}
    >

      {i !== 3 ? label : <Red to={path} style={{color: '#343D48'}}>{label}</Red>}
    </MenuLink>
  );
}

export function Link({ path, label, children, ...rest }) {
  return (
      <A {...rest}>{children ? children : label}</A>
  );
}

export function LearnMore({ path, label, children, ...rest }) {
  return (
      <A sx={styles.learnMore} {...rest}>
        {label ?? 'Learn More'} <HiOutlineChevronRight />
      </A>
  );
}

const styles = {
  learnMore: {
    color: 'link',
    cursor: 'pointer',
    fontSize: [1, 1, 1, 2],
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    svg: {
      transition: 'margin-left 0.3s ease-in-out 0s',
      ml: '3px',
    },
    ':hover': {
      svg: {
        ml: '5px',
      },
    },
  },
};
