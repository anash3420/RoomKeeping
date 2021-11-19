/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from './link';
import { toAbsoluteUrl } from '../../../../_metronic/_helpers';

export default function Logo({ isSticky, footer, ...props }) {
  return (
    <Link path="/" sx={styles.logo} {...props}>
      <img
          src={toAbsoluteUrl("/media/logos/Room_Keeping-removebg-preview.png")}
          alt="RoomKeeping logo"
          width = "200px"
          // height = "100"
        />
    </Link>
  );
}
const styles = {
  logo: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    svg: {
      height: 'auto',
      width: [128, null, '100%'],
    },
  },
};
