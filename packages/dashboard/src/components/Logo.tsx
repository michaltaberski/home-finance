import styled from "styled-components";
import { grey } from "@ant-design/colors";

const LogoWrapper = styled.div`
  float: left;
  color: ${grey[0]};
  font-size: 16px;
  padding-right: 16px;

  display: flex;

  span {
    padding-left: 4px;
    color: white;
    font-size: 1.5em;
  }
`;

export const Logo = () => (
  <LogoWrapper>
    <span>H</span>ome <span>F</span>inance
  </LogoWrapper>
);
