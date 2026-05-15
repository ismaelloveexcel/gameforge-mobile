/**
 * Snake and Ladders - Personalized Couples Game
 * 
 * PREMIUM FEATURE: Upload 2 photos → Become game characters!
 * Classic game with YOUR faces as the playing pieces
 * 
 * Perfect for:
 * - Couples (both in the game!)
 * - Friends
 * - Family members
 * - Anyone with 2 photos!
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated as RNAnimated,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radii, typography } from '../design-tokens/theme';
import DodoCompanion from '../components/DodoCompanion';

interface Player {
  name: string;
  position: number;
  photoUrl?: string;
  color: string;
}

interface SnakeOrLadder {
  from: number;
  to: number;
  type: 'snake' | 'ladder';
}

export interface SnakeAndLaddersProps {
  player1Name: string;
  player2Name: string;
  player1Photo?: string;
  player2Photo?: string;
  onGameEnd: (winner: string) => void;
}

export default function SnakeAndLaddersGame({
  player1Name,
  player2Name,
  player1Photo,
  player2Photo,
  onGameEnd,
}: SnakeAndLaddersProps) {
  const { theme } = useTheme();
  
  const [players, setPlayers] = useState<Player[]>([
    { name: player1Name, position: 0, photoUrl: player1Photo, color: '#FF6B9D' },
    { name: player2Name, position: 0, photoUrl: player2Photo, color: '#4ECDC4' },
  ]);
  
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState(`${player1Name}'s turn!`);
  const [winner, setWinner] = useState<string | null>(null);
  
  const diceRotation = useSharedValue(0);
  const diceScale = useSharedValue(1);

  // Snake and Ladders configuration
  const snakesAndLadders: SnakeOrLadder[] = [
    // Ladders (climb up!) 🪜
    { from: 4, to: 14, type: 'ladder' },
    { from: 9, to: 31, type: 'ladder' },
    { from: 20, to: 38, type: 'ladder' },
    { from: 28, to: 84, type: 'ladder' },
    { from: 40, to: 59, type: 'ladder' },
    { from: 51, to: 67, type: 'ladder' },
    { from: 63, to: 81, type: 'ladder' },
    
    // Snakes (slide down!) 🐍
    { from: 17, to: 7, type: 'snake' },
    { from: 54, to: 34, type: 'snake' },
    { from: 62, to: 19, type: 'snake' },
    { from: 64, to: 60, type: 'snake' },
    { from: 87, to: 36, type: 'snake' },
    { from: 93, to: 73, type: 'snake' },
    { from: 95, to: 75, type: 'snake' },
    { from: 99, to: 78, type: 'snake' },
  ];

  const rollDice = useCallback(() => {
    if (isRolling || winner) return;
    
    setIsRolling(true);
    setMessage('Rolling...');
    
    // Dice roll animation
    diceRotation.value = withSequence(
      withTiming(360 * 5, { duration: 1000 }),
      withTiming(0, { duration: 0 })
    );
    
    diceScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      
      // Move player
      setTimeout(() => movePlayer(roll), 500);
    }, 1000);
  }, [isRolling, winner, currentPlayer]);

  const movePlayer = useCallback((steps: number) => {
    const playerIndex = currentPlayer;
    const player = players[playerIndex];
    let newPosition = player.position + steps;
    
    // Can't go over 100
    if (newPosition > 100) {
      setMessage(`${player.name} rolled too high! Stay put.`);
      setIsRolling(false);
      switchTurn();
      return;
    }
    
    setMessage(`${player.name} moves ${steps} spaces!`);
    
    // Update position
    const newPlayers = [...players];
    newPlayers[playerIndex].position = newPosition;
    setPlayers(newPlayers);
    
    // Check for snake or ladder
    setTimeout(() => {
      checkSnakeOrLadder(newPosition, playerIndex);
    }, 1000);
  }, [currentPlayer, players]);

  const checkSnakeOrLadder = useCallback((position: number, playerIndex: number) => {
    const found = snakesAndLadders.find(sl => sl.from === position);
    
    if (found) {
      const player = players[playerIndex];
      
      if (found.type === 'ladder') {
        setMessage(`${player.name} found a ladder! Climbing to ${found.to}! 🪜`);
        
        const newPlayers = [...players];
        newPlayers[playerIndex].position = found.to;
        setPlayers(newPlayers);
      } else {
        setMessage(`${player.name} hit a snake! Sliding to ${found.to}... 🐍`);
        
        const newPlayers = [...players];
        newPlayers[playerIndex].position = found.to;
        setPlayers(newPlayers);
      }
      
      setTimeout(() => checkWinner(found.to, playerIndex), 1500);
    } else {
      checkWinner(position, playerIndex);
    }
  }, [players, snakesAndLadders]);

  const checkWinner = useCallback((position: number, playerIndex: number) => {
    if (position === 100) {
      const player = players[playerIndex];
      setWinner(player.name);
      setMessage(`${player.name} WINS! 🎉🏆`);
      setTimeout(() => {
        onGameEnd(player.name);
      }, 2000);
    } else {
      setIsRolling(false);
      switchTurn();
    }
  }, [players, onGameEnd]);

  const switchTurn = useCallback(() => {
    const nextPlayer = (currentPlayer + 1) % players.length;
    setCurrentPlayer(nextPlayer);
    setMessage(`${players[nextPlayer].name}'s turn!`);
  }, [currentPlayer, players]);

  const diceStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${diceRotation.value}deg` },
      { scale: diceScale.value },
    ],
  }));

  // Render board cell
  const renderCell = (cellNumber: number) => {
    const row = Math.floor((cellNumber - 1) / 10);
    const isEvenRow = row % 2 === 0;
    const col = isEvenRow ? (cellNumber - 1) % 10 : 9 - ((cellNumber - 1) % 10);
    
    const player1Here = players[0].position === cellNumber;
    const player2Here = players[1].position === cellNumber;
    
    const hasSnakeOrLadder = snakesAndLadders.find(sl => sl.from === cellNumber);
    
    return (
      <View
        key={cellNumber}
        style={[
          styles.cell,
          { backgroundColor: theme.colors.card },
          hasSnakeOrLadder && { backgroundColor: hasSnakeOrLadder.type === 'ladder' ? '#10B98120' : '#EF444420' },
        ]}
      >
        <Text style={[styles.cellNumber, { color: theme.colors.notification }]}>
          {cellNumber}
        </Text>
        
        {/* Snake or Ladder indicator */}
        {hasSnakeOrLadder && (
          <Text style={styles.indicator}>
            {hasSnakeOrLadder.type === 'ladder' ? '🪜' : '🐍'}
          </Text>
        )}
        
        {/* Player pieces */}
        <View style={styles.playersOnCell}>
          {player1Here && (
            player1Photo ? (
              <Image source={{ uri: player1Photo }} style={[styles.playerPhoto, { borderColor: players[0].color }]} />
            ) : (
              <View style={[styles.playerPiece, { backgroundColor: players[0].color }]}>
                <Text style={styles.playerInitial}>{player1Name[0]}</Text>
              </View>
            )
          )}
          {player2Here && (
            player2Photo ? (
              <Image source={{ uri: player2Photo }} style={[styles.playerPhoto, { borderColor: players[1].color }]} />
            ) : (
              <View style={[styles.playerPiece, { backgroundColor: players[1].color }]}>
                <Text style={styles.playerInitial}>{player2Name[0]}</Text>
              </View>
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Dodo watching */}
      <View style={styles.dodoCorner}>
        <DodoCompanion
          mood={winner ? 'celebrating' : isRolling ? 'excited' : 'curious'}
          size="small"
          message={message}
          showBubble={true}
        />
      </View>

      {/* Game Board */}
      <View style={styles.boardContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Snake & Ladders
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.notification }]}>
          {player1Name} vs {player2Name}
        </Text>

        <View style={styles.board}>
          {/* Render 100 cells (bottom to top, zigzag) */}
          {Array.from({ length: 10 }, (_, rowIndex) => {
            const row = 9 - rowIndex; // Start from top
            return (
              <View key={row} style={styles.row}>
                {Array.from({ length: 10 }, (_, colIndex) => {
                  const isEvenRow = row % 2 === 0;
                  const cellNum = row * 10 + (isEvenRow ? colIndex + 1 : 10 - colIndex);
                  return renderCell(cellNum);
                })}
              </View>
            );
          })}
        </View>
      </View>

      {/* Game Controls */}
      <View style={styles.controls}>
        {/* Current player indicator */}
        <View style={styles.playerIndicator}>
          <View style={styles.playerInfo}>
            {player1Photo ? (
              <Image source={{ uri: player1Photo }} style={[styles.playerAvatar, currentPlayer === 0 && styles.activePlayer]} />
            ) : (
              <View style={[styles.playerAvatar, { backgroundColor: players[0].color }, currentPlayer === 0 && styles.activePlayer]}>
                <Text style={styles.avatarText}>{player1Name[0]}</Text>
              </View>
            )}
            <Text style={[styles.playerName, { color: theme.colors.text }]}>
              {player1Name}: {players[0].position}
            </Text>
          </View>
          
          <View style={styles.playerInfo}>
            {player2Photo ? (
              <Image source={{ uri: player2Photo }} style={[styles.playerAvatar, currentPlayer === 1 && styles.activePlayer]} />
            ) : (
              <View style={[styles.playerAvatar, { backgroundColor: players[1].color }, currentPlayer === 1 && styles.activePlayer]}>
                <Text style={styles.avatarText}>{player2Name[0]}</Text>
              </View>
            )}
            <Text style={[styles.playerName, { color: theme.colors.text }]}>
              {player2Name}: {players[1].position}
            </Text>
          </View>
        </View>

        {/* Dice */}
        <TouchableOpacity
          style={[styles.diceContainer, { backgroundColor: theme.colors.card }]}
          onPress={rollDice}
          disabled={isRolling || !!winner}
        >
          <Animated.View style={[styles.dice, diceStyle]}>
            <Text style={styles.diceNumber}>{diceValue}</Text>
          </Animated.View>
          <Text style={[styles.rollText, { color: theme.colors.text }]}>
            {isRolling ? 'Rolling...' : winner ? '🎉 Game Over!' : 'Tap to Roll'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Winner overlay */}
      {winner && (
        <View style={styles.winnerOverlay}>
          <View style={[styles.winnerCard, { backgroundColor: theme.colors.card }]}>
            <Text style={styles.winnerEmoji}>🏆</Text>
            <Text style={[styles.winnerText, { color: theme.colors.text }]}>
              {winner} WINS!
            </Text>
            <Text style={[styles.winnerSubtext, { color: theme.colors.notification }]}>
              Reached square 100!
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dodoCorner: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1000,
  },
  boardContainer: {
    flex: 1,
    padding: spacing.md,
    paddingTop: 120,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.sm,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  board: {
    aspectRatio: 1,
    maxWidth: 400,
    alignSelf: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cellNumber: {
    fontSize: 8,
    position: 'absolute',
    top: 2,
    left: 2,
  },
  indicator: {
    fontSize: 10,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  playersOnCell: {
    flexDirection: 'row',
    gap: 2,
  },
  playerPiece: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  playerInitial: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  controls: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  playerIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  playerInfo: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  activePlayer: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  diceContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radii.xl,
  },
  dice: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  diceNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  rollText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    marginTop: spacing.md,
  },
  winnerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerCard: {
    padding: spacing.xxl,
    borderRadius: radii.xl,
    alignItems: 'center',
    minWidth: 280,
  },
  winnerEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  winnerText: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  winnerSubtext: {
    fontSize: typography.size.base,
  },
});
