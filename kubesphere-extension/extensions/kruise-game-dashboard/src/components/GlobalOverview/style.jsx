import styled from 'styled-components';

export const GlobalOverviewWrapper = styled.div`
  padding: 20px;
  color: #333;
  .intro, .about, .features, .core-components, .why-okg, .dashboard-pages {
    margin-bottom: 20px;
  }
`;

export const Title = styled.h1`
  text-align: center;
`;

export const SectionHeader = styled.h2`
  border-bottom: 2px solid #0056b3;
  padding-bottom: 5px;
  color: #0056b3;
`;

export const SectionContent = styled.p`
  margin: 10px 0;
`;

export const List = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
  li {
    margin-bottom: 10px;
  }
`;

export const CoreComponentsList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
  li {
    margin-bottom: 10px;
  }
`;

export const WhyOKGList = styled.ul`
  li {
    margin-bottom: 10px;
  }
`;

export const DashboardPagesList = styled.ul`
  li {
    margin-bottom: 10px;
  }
`;
