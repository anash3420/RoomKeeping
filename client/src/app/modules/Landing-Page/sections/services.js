/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Box, Container } from 'theme-ui';
import { rgba } from 'polished';
import SectionHeading from '../components/section-heading';
import Service from '../components/cards/service';
import icon2 from '../assets/images/icons/service2.png';
import icon1 from '../assets/images/icons/service4.png';
import icon3 from '../assets/images/icons/service9.png';

const data = [
  {
    id: 1,
    icon: icon1,
    title: 'Clean Requests',
    description: `Get your clean Requests managed by our app with just a single click.!`,
  },
  {
    id: 3,
    icon: icon2,
    title: 'Flexibility',
    description: `Get your work done under any given condition including student-roomkeeper complaint.`,
  },
  {
    id: 4,
    icon: icon3,
    title: 'User Management',
    description: `Manage students and Room Keepers on the fly along with managing them.`,
  },
];

const Services = () => {
  return (
    <Box as="section" id="services" sx={styles.section}>
      <Container>
        <SectionHeading
          sx={styles.heading}
          title="Ease your work with our Service"
          description="Don't worry about managing the roomkeeper schedule. We've got you covered!"
        />
        <Box sx={styles.contentWrapper}>
          {data?.map((item) => (
            <Service key={item.id} item={item} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Services;

const styles = {
  section: {
    backgroundColor: rgba('#FFF5ED', 0.5),
    pt: [11, 11, 11, 12, 12, 12, 14],
    pb: [7, 7, 7, 9, 9, 10, 11],
  },
  heading: {
    maxWidth: [null, null, null, 455, 660],
    mb: [6, null, null, 8, null, 9, 13],
  },
  contentWrapper: {
    gap: 30,
    display: 'grid',
    justifyContent: ['center', null, null, 'unset'],
    gridTemplateColumns: [
      'repeat(1, 285px)',
      'repeat(1, 325px)',
      'repeat(1, 285px)',
      'repeat(3, 1fr)',
    ],
  },
};
