import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  .site-layout-content {
    min-height: 280px;
    padding: 24px;
    background: #fff;
  }

  #components-layout-demo-top .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
  }

  .ant-row-rtl #components-layout-demo-top .logo {
    float: right;
    margin: 16px 0 16px 24px;
  }

  #root {
    display: flex;
    min-height: 100%;
  }
`;
