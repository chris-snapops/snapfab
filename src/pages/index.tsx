import { Title, Text, Container, Card, Grid, ThemeIcon, Stack, Button, Group, Badge, Anchor } from "@mantine/core";
import { Rocket, Shield, Zap, ArrowRight, Table } from "lucide-react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout title="Home">
      <Container size="lg" py={40}>
        <Title>SnapFab</Title>
        <Text mt="md">
          <Anchor 
            href="https://docs.google.com/document/d/1-tlPo4pBpPV-AspNmSzo1AseV-8MO9dct7eIUCP4MiQ/edit?tab=t.0#heading=h.bzq9yb7uz90q" 
            target="_blank" 
            underline="always"
            style={{ textUnderlineOffset: '2px' }}
          >
            End Goal
          </Anchor>
        </Text>
      </Container>
    </Layout>
  );
}

function rem(px: number) {
  return `${px / 16}rem`;
}
