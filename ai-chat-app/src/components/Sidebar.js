import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { Home, MessageSquare, Table, ChartPie, Book, ChevronLeft, ChevronRight } from "lucide-react";


const SidebarContainer = styled.div`
  width: ${props => props.isOpen ? '280px' : '80px'};
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.98);
  color: #1d1d1f;
  position: fixed;
  left: 0;
  top: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`;

const ToggleButton = styled.button`
  position: absolute;
  right: -20px;
  top: 24px;
  background-color: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(0, 0, 0, 0.06);
  color: #1d1d1f;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 32px 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.li`
  padding: 0;
  margin: 0 16px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #1d1d1f;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &.active {
    background-color: rgba(0, 0, 0, 0.06);
    font-weight: 600;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: ${props => props.isOpen ? '12px' : '0'};
    stroke-width: 1.5px;
    color: #1d1d1f;
    opacity: 0.9;
  }
`;

const IconText = styled.span`
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-10px)'};
  font-weight: 500;
`;

const Sidebar = ({ isOpen, setIsOpen }) => {

  return (
    <SidebarContainer isOpen={isOpen}>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </ToggleButton>
      <NavList>
        <NavItem>
          <StyledNavLink to="/" isOpen={isOpen}>
            < Home />
            <IconText isOpen={isOpen}>Home</IconText>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/data" isOpen={isOpen}>
            <Table />
            <IconText isOpen={isOpen}>Table</IconText>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/analysis" isOpen={isOpen}>
            <ChartPie />
            <IconText isOpen={isOpen}>Analysis</IconText>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/chat" isOpen={isOpen}>
            <MessageSquare />
            <IconText isOpen={isOpen}>Chat</IconText>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/methodology" isOpen={isOpen}>
            <Book />
            <IconText isOpen={isOpen}>Methodology</IconText>
          </StyledNavLink>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar; 