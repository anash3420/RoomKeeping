/** @jsxRuntime classic */
/** @jsx jsx */
import {
  jsx,
  Box,
  Container,
  Image,
  Text,
  Heading,
  Link,
} from "theme-ui";
import SectionHeading from "../components/section-heading";

import avatar1 from "../assets/images/team/member1.png";
import avatar3 from "../assets/images/team/member3.png";

import { FaLinkedin, FaGithub,  } from "react-icons/fa";

const data = [
  {
    id: 1,
    avatar: avatar1,
    name: "Anash Shelat",
    designation: "Lead Developer & System Designer",
    socialLinks: [
      {
        link: "https://www.linkedin.com/in/anash-shelat-2378411b4/",
      },
      {
        link: "https://github.com/anash3420",
      },
    ],
  },
  {
    id: 2,
    avatar: avatar3,
    name: "Devarshi Mahadevwala",
    designation: "Ethical Hacker",
    socialLinks: [
      {
        link: "https://www.linkedin.com/in/devarshi-mahadevwala-4bbb8321a/",
      },
      {
        link: "https://github.com/devarshi-mahadevwala",
      },
    ],
  },
];

const OurTeam = () => {
  return (
    <Box as="section" id="team" sx={styles.section}>
      <Container>
        <SectionHeading
          sx={styles.heading}
          title="Meet our superheros"
          description="The students with vision to do something good for the world."
        />
      </Container>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="text-center">
            <Image src={data[0].avatar} className="text-center" />
          </div>
          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              <Box sx={styles.about}>
                <Heading as="h3">{data[0].name}</Heading>
                <Text as="p">{data[0].designation}</Text>
                <Link href={data[0].socialLinks[0].link} className="mr-2" target="_blank">
                  <FaLinkedin size="18px" color="#55ACEE" />
                </Link>
                <Link href={data[0].socialLinks[1].link} className="mr-2" target="_blank">
                  <FaGithub size="18px" color="#161614" />
                </Link>
              </Box>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="text-center">
            <Image src={data[1].avatar} className="text-center" />
          </div>
          <div className="row">
            <div className="col-3"></div>
            <div className="col-6">
              <Box sx={styles.about}>
                <Heading as="h3">{data[1].name}</Heading>
                <Text as="p">{data[1].designation}</Text>
                <Link href={data[1].socialLinks[0].link} className="mr-2" target="_blank">
                  <FaLinkedin size="18px" color="#55ACEE" />
                </Link>
                <Link href={data[1].socialLinks[1].link} className="mr-2" target="_blank">
                  <FaGithub size="18px" color="#161614" />
                </Link>
              </Box>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default OurTeam;

const styles = {
  section: {
    pt: [11],
    pb: [11, null, null, 12, null, 14],
  },
  heading: {
    p: {
      maxWidth: 500,
      m: "10px auto 0",
    },
  },
  teamWrapper: {
    // position: "relative",
    // pl: [6],
    // pr: [6, null, null, 0],
    transition: "0.3s ease-in-out 0s",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  about: {
    mt: [4],
    textAlign: ["center", null, null, "left"],
    h3: {
      color: "heading",
      fontFamily: "body",
      fontSize: [3, null, 17, null, 4],
    },
    p: {
      color: "#7589A1",
      letterSpacing: "-0.2px",
      mt: [2],
    },
  },
  socialLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: ["center", null, null, "left"],
    mt: [3],
    a: {
      display: "inline-flex",
      mr: [4],
    },
  },
};
