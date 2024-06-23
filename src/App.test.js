import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";
import * as backend from "../../src/backend";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

jest.mock("../../src/backend", () => ({
  getAllProfiles: jest.fn(),
  getSavedProfiles: jest.fn(),
  addToSaved: jest.fn(),
}));

const mockUsers = [
  {
    userId: "1",
    name: "John Doe",
    gender: "Male",
    age: 30,
    program: "Software Engineer",
    smoker: "No",
    anyPets: "No",
    languages: "English",
    sleepAt: "10 PM",
    wakeUpAt: "6 AM",
    interests: "Reading, Coding",
    lookingIn: "New York",
  },
  {
    userId: "2",
    name: "Jane Doe",
    gender: "Female",
    age: 25,
    program: "Designer",
    smoker: "No",
    anyPets: "Yes",
    languages: "English, Spanish",
    sleepAt: "11 PM",
    wakeUpAt: "7 AM",
    interests: "Art, Music",
    lookingIn: "Los Angeles",
  },
];

const mockSavedProfiles = [
  {
    userId: "1",
  },
];

describe("Home Component", () => {
  beforeEach(() => {
    backend.getAllProfiles.mockResolvedValue(mockUsers);
    backend.getSavedProfiles.mockResolvedValue(mockSavedProfiles);
  });

  test("renders profiles and checks saved state", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    const saveButtonJohn = screen.getByText("Saved");
    const saveButtonJane = screen.getByText("Save");

    expect(saveButtonJohn).toBeDisabled();
    expect(saveButtonJane).toBeEnabled();
  });

  test("applies gender filter correctly", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Gender:"), {
      target: { value: "Female" },
    });

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  test("applies smoker filter correctly", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Smoker:"), {
      target: { value: "Yes" },
    });

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
  });

  test("saves a profile and updates button state", async () => {
    backend.addToSaved.mockResolvedValue(true);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    const saveButtonJane = screen.getByText("Save");

    fireEvent.click(saveButtonJane);

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
      expect(saveButtonJane).toBeDisabled();
    });
  });
});
