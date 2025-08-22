import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TripWizard } from '../components/TripWizard';

// Mock the trip service
vi.mock('../services/tripService', () => ({
  createTrip: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('TripWizard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the first step by default', () => {
    renderWithRouter(<TripWizard />);
    
    expect(screen.getByText(/family profile/i)).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
  });

  it('should show progress indicator', () => {
    renderWithRouter(<TripWizard />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '25');
  });

  it('should validate family profile form', async () => {
    renderWithRouter(<TripWizard />);
    
    // Try to proceed without filling required fields
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/family name is required/i)).toBeInTheDocument();
    });
  });

  it('should proceed to next step when form is valid', async () => {
    renderWithRouter(<TripWizard />);
    
    // Fill in required fields
    const familyNameInput = screen.getByLabelText(/family name/i);
    fireEvent.change(familyNameInput, { target: { value: 'Test Family' } });
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/destination/i)).toBeInTheDocument();
      expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();
    });
  });

  it('should allow going back to previous step', async () => {
    renderWithRouter(<TripWizard />);
    
    // Go to step 2
    const familyNameInput = screen.getByLabelText(/family name/i);
    fireEvent.change(familyNameInput, { target: { value: 'Test Family' } });
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/destination/i)).toBeInTheDocument();
    });
    
    // Go back to step 1
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    await waitFor(() => {
      expect(screen.getByText(/family profile/i)).toBeInTheDocument();
      expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();
    });
  });

  it('should handle destination selection', async () => {
    renderWithRouter(<TripWizard />);
    
    // Navigate to destination step
    const familyNameInput = screen.getByLabelText(/family name/i);
    fireEvent.change(familyNameInput, { target: { value: 'Test Family' } });
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/destination/i)).toBeInTheDocument();
    });
    
    // Select a destination
    const destinationInput = screen.getByPlaceholderText(/search destinations/i);
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });
    
    // Wait for search results and select
    await waitFor(() => {
      const parisOption = screen.getByText(/paris, france/i);
      fireEvent.click(parisOption);
    });
    
    // Proceed to next step
    const nextButton2 = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton2);
    
    await waitFor(() => {
      expect(screen.getByText(/dates & budget/i)).toBeInTheDocument();
      expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();
    });
  });

  it('should handle date and budget selection', async () => {
    renderWithRouter(<TripWizard />);
    
    // Navigate to dates & budget step
    const familyNameInput = screen.getByLabelText(/family name/i);
    fireEvent.change(familyNameInput, { target: { value: 'Test Family' } });
    
    let nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/destination/i)).toBeInTheDocument();
    });
    
    const destinationInput = screen.getByPlaceholderText(/search destinations/i);
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });
    
    await waitFor(() => {
      const parisOption = screen.getByText(/paris, france/i);
      fireEvent.click(parisOption);
    });
    
    nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/dates & budget/i)).toBeInTheDocument();
    });
    
    // Set dates
    const startDateInput = screen.getByLabelText(/start date/i);
    fireEvent.change(startDateInput, { target: { value: '2024-06-01' } });
    
    const endDateInput = screen.getByLabelText(/end date/i);
    fireEvent.change(endDateInput, { target: { value: '2024-06-08' } });
    
    // Set budget
    const budgetInput = screen.getByLabelText(/budget/i);
    fireEvent.change(budgetInput, { target: { value: '5000' } });
    
    // Proceed to final step
    nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/review & create/i)).toBeInTheDocument();
      expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();
    });
  });

  it('should show trip summary in final step', async () => {
    renderWithRouter(<TripWizard />);
    
    // Complete all steps to reach final step
    // Step 1: Family Profile
    const familyNameInput = screen.getByLabelText(/family name/i);
    fireEvent.change(familyNameInput, { target: { value: 'Test Family' } });
    
    let nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Step 2: Destination
    await waitFor(() => {
      expect(screen.getByText(/destination/i)).toBeInTheDocument();
    });
    
    const destinationInput = screen.getByPlaceholderText(/search destinations/i);
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });
    
    await waitFor(() => {
      const parisOption = screen.getByText(/paris, france/i);
      fireEvent.click(parisOption);
    });
    
    nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Step 3: Dates & Budget
    await waitFor(() => {
      expect(screen.getByText(/dates & budget/i)).toBeInTheDocument();
    });
    
    const startDateInput = screen.getByLabelText(/start date/i);
    fireEvent.change(startDateInput, { target: { value: '2024-06-01' } });
    
    const endDateInput = screen.getByLabelText(/end date/i);
    fireEvent.change(endDateInput, { target: { value: '2024-06-08' } });
    
    const budgetInput = screen.getByLabelText(/budget/i);
    fireEvent.change(budgetInput, { target: { value: '5000' } });
    
    nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Step 4: Review & Create
    await waitFor(() => {
      expect(screen.getByText(/review & create/i)).toBeInTheDocument();
    });
    
    // Check that trip summary is displayed
    expect(screen.getByText(/test family/i)).toBeInTheDocument();
    expect(screen.getByText(/paris, france/i)).toBeInTheDocument();
    expect(screen.getByText(/june 1, 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/june 8, 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/\$5,000/i)).toBeInTheDocument();
  });

  it('should create trip when form is submitted', async () => {
    const mockCreateTrip = vi.mocked(await import('../services/tripService')).createTrip;
    mockCreateTrip.mockResolvedValue({ id: 'trip-123', success: true });
    
    renderWithRouter(<TripWizard />);
    
    // Complete all steps
    // Step 1: Family Profile
    const familyNameInput = screen.getByLabelText(/family name/i);
    fireEvent.change(familyNameInput, { target: { value: 'Test Family' } });
    
    let nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Step 2: Destination
    await waitFor(() => {
      expect(screen.getByText(/destination/i)).toBeInTheDocument();
    });
    
    const destinationInput = screen.getByPlaceholderText(/search destinations/i);
    fireEvent.change(destinationInput, { target: { value: 'Paris' } });
    
    await waitFor(() => {
      const parisOption = screen.getByText(/paris, france/i);
      fireEvent.click(parisOption);
    });
    
    nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Step 3: Dates & Budget
    await waitFor(() => {
      expect(screen.getByText(/dates & budget/i)).toBeInTheDocument();
    });
    
    const startDateInput = screen.getByLabelText(/start date/i);
    fireEvent.change(startDateInput, { target: { value: '2024-06-01' } });
    
    const endDateInput = screen.getByLabelText(/end date/i);
    fireEvent.change(endDateInput, { target: { value: '2024-06-08' } });
    
    const budgetInput = screen.getByLabelText(/budget/i);
    fireEvent.change(budgetInput, { target: { value: '5000' } });
    
    nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Step 4: Submit
    await waitFor(() => {
      expect(screen.getByText(/review & create/i)).toBeInTheDocument();
    });
    
    const createButton = screen.getByRole('button', { name: /create trip/i });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockCreateTrip).toHaveBeenCalledWith({
        familyName: 'Test Family',
        destination: 'Paris, France',
        startDate: '2024-06-01',
        endDate: '2024-06-08',
        budget: 5000,
      });
    });
  });

  it('should show loading state during submission', async () => {
    const mockCreateTrip = vi.mocked(await import('../services/tripService')).createTrip;
    mockCreateTrip.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    renderWithRouter(<TripWizard />);
    
    // Complete form and submit
    // ... (complete form steps as above)
    
    const createButton = screen.getByRole('button', { name: /create trip/i });
    fireEvent.click(createButton);
    
    expect(screen.getByText(/creating trip/i)).toBeInTheDocument();
    expect(createButton).toBeDisabled();
  });

  it('should handle form submission errors', async () => {
    const mockCreateTrip = vi.mocked(await import('../services/tripService')).createTrip;
    mockCreateTrip.mockRejectedValue(new Error('Failed to create trip'));
    
    renderWithRouter(<TripWizard />);
    
    // Complete form and submit
    // ... (complete form steps as above)
    
    const createButton = screen.getByRole('button', { name: /create trip/i });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to create trip/i)).toBeInTheDocument();
    });
  });
});
