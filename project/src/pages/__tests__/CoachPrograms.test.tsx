/// <reference types="jest" />
import type {} from '@jest/globals';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import CoachPrograms from '../CoachPrograms';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    token: 'test-token',
  }),
}));

const mockPrograms = [
  {
    id: 1,
    programName: 'Beginner Cricket Training',
    description: 'Introduction to cricket basics',
    duration: '4 weeks',
    price: 199.99,
    level: 'Beginner',
    category: 'Training',
    isActive: true,
    coaches: [1, 2],
  },
  {
    id: 2,
    programName: 'Advanced Batting Techniques',
    description: 'Master advanced batting skills',
    duration: '6 weeks',
    price: 299.99,
    level: 'Advanced',
    category: 'Specialized',
    isActive: true,
    coaches: [3],
  },
];

describe('CoachPrograms Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockPrograms });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <AuthProvider>
        <CoachPrograms />
      </AuthProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders programs after loading', async () => {
    render(
      <AuthProvider>
        <CoachPrograms />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Beginner Cricket Training')).toBeInTheDocument();
      expect(screen.getByText('Advanced Batting Techniques')).toBeInTheDocument();
    });
  });

  test('filters programs by search term', async () => {
    render(
      <AuthProvider>
        <CoachPrograms />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Beginner Cricket Training')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name or description...');
    await userEvent.type(searchInput, 'Advanced');

    expect(screen.queryByText('Beginner Cricket Training')).not.toBeInTheDocument();
    expect(screen.getByText('Advanced Batting Techniques')).toBeInTheDocument();
  });

  test('filters programs by category', async () => {
    render(
      <AuthProvider>
        <CoachPrograms />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Beginner Cricket Training')).toBeInTheDocument();
    });

    const categorySelect = screen.getByLabelText('Filter by Category');
    await userEvent.selectOptions(categorySelect, 'Training');

    expect(screen.getByText('Beginner Cricket Training')).toBeInTheDocument();
    expect(screen.queryByText('Advanced Batting Techniques')).not.toBeInTheDocument();
  });

  test('filters programs by level', async () => {
    render(
      <AuthProvider>
        <CoachPrograms />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Beginner Cricket Training')).toBeInTheDocument();
    });

    const levelSelect = screen.getByLabelText('Filter by Level');
    await userEvent.selectOptions(levelSelect, 'Advanced');

    expect(screen.queryByText('Beginner Cricket Training')).not.toBeInTheDocument();
    expect(screen.getByText('Advanced Batting Techniques')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    render(
      <AuthProvider>
        <CoachPrograms />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch programs')).toBeInTheDocument();
    });
  });

  test('displays no programs message when filtered results are empty', async () => {
    render(
      <AuthProvider>
        <CoachPrograms />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Beginner Cricket Training')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name or description...');
    await userEvent.type(searchInput, 'Non-existent program');

    expect(screen.getByText('No programs found matching your criteria.')).toBeInTheDocument();
  });
});
