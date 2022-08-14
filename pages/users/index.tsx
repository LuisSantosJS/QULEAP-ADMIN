import type { NextPage } from "next";
import Container from "../../components/container";
import { UsersC } from "../../components/users";

const Users: NextPage = () => {
  return (
    <Container title="USERS">
      <UsersC />
    </Container>
  );
};

export default Users;
