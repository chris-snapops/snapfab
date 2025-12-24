import { Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Heading mb="4">SnapFab</Heading>
      <Text>
        <ChakraLink 
          href="https://docs.google.com/document/d/1-tlPo4pBpPV-AspNmSzo1AseV-8MO9dct7eIUCP4MiQ/edit?tab=t.0#heading=h.bzq9yb7uz90q" 
          isExternal 
          className="blue-link"
        >
          End goal
        </ChakraLink>
      </Text>
    </Layout>
  );
}
