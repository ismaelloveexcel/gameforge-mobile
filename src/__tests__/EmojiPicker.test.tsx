/**
 * EmojiPicker Component Tests
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EmojiPicker from '../components/EmojiPicker';

jest.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#6B4CE6',
        surface: '#ffffff',
        text: '#1a1a1a',
        textSecondary: '#666666',
        border: '#e0e0e0',
      },
    },
  }),
}));

describe('EmojiPicker', () => {
  it('renders correctly', () => {
    const onEmojiSelect = jest.fn();
    const { getByPlaceholderText } = render(
      <EmojiPicker onEmojiSelect={onEmojiSelect} />
    );
    
    expect(getByPlaceholderText('Search emojis...')).toBeTruthy();
  });

  it('calls onEmojiSelect when emoji is pressed', () => {
    const onEmojiSelect = jest.fn();
    const { getAllByText } = render(
      <EmojiPicker onEmojiSelect={onEmojiSelect} />
    );
    
    const emojis = getAllByText(/😀|😃|😄/);
    if (emojis.length > 0) {
      fireEvent.press(emojis[0]);
      expect(onEmojiSelect).toHaveBeenCalled();
    }
  });

  it('filters categories based on props', () => {
    const onEmojiSelect = jest.fn();
    const { getByText } = render(
      <EmojiPicker 
        onEmojiSelect={onEmojiSelect} 
        categories={['smileys', 'animals']}
      />
    );
    
    expect(getByText('Smileys')).toBeTruthy();
    expect(getByText('Animals')).toBeTruthy();
  });

  it('hides search when showSearch is false', () => {
    const onEmojiSelect = jest.fn();
    const { queryByPlaceholderText } = render(
      <EmojiPicker onEmojiSelect={onEmojiSelect} showSearch={false} />
    );
    
    expect(queryByPlaceholderText('Search emojis...')).toBeNull();
  });
});
