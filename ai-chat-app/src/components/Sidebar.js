import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { Home, MessageSquare, Table, ChartPie, Book } from "lucide-react";


const SidebarContainer = styled.div`
  width: ${props => props.isOpen ? '220px' : '60px'};
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s ease;
  z-index: 1000;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: -12px;
  top: 20px;
  background-color: #2c3e50;
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 20px 0;
  margin: 0;
  width: 100%;
`;

const NavItem = styled.li`
  padding: 0;
  margin: 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background-color: #34495e;
  }

  &.active {
    background-color: #3498db;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: ${props => props.isOpen ? '15px' : '0'};
  }
`;

const IconText = styled.span`
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContainer isOpen={isOpen}>
      <NavList>
        <NavItem>
          <StyledNavLink to="/" isOpen={isOpen}>
            < Home />
            <IconText isOpen={isOpen}>Home</IconText>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/methodology" isOpen={isOpen}>
            <Book />
            <IconText isOpen={isOpen}>Methodology</IconText>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/chat" isOpen={isOpen}>
            <MessageSquare />
            <IconText isOpen={isOpen}>Chat</IconText>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/analysis" isOpen={isOpen}>
            <ChartPie />
            <IconText isOpen={isOpen}>Analysis</IconText>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/data" isOpen={isOpen}>
            <Table />
            <IconText isOpen={isOpen}>Table</IconText>
          </StyledNavLink>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar; 