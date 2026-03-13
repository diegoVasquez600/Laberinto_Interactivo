import pygame
import sys

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 1000
SCREEN_HEIGHT = 700
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (100, 149, 237)
GREEN = (76, 175, 80)
RED = (244, 67, 54)
YELLOW = (255, 235, 59)
GRAY = (128, 128, 128)

class Player:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.size = 30
        self.speed = 5
        self.color = BLUE
        
    def move(self, dx, dy, walls):
        new_x = self.x + dx
        new_y = self.y + dy
        
        # Check collision with walls
        player_rect = pygame.Rect(new_x, new_y, self.size, self.size)
        collision = False
        for wall in walls:
            if player_rect.colliderect(wall):
                collision = True
                break
        
        if not collision:
            self.x = new_x
            self.y = new_y
    
    def draw(self, screen):
        pygame.draw.circle(screen, self.color, (self.x + self.size // 2, self.y + self.size // 2), self.size // 2)


class Station:
    def __init__(self, x, y, question, answer, station_type="button"):
        self.x = x
        self.y = y
        self.size = 50
        self.question = question
        self.answer = answer
        self.station_type = station_type  # "button" or "door"
        self.activated = False
        self.show_answer = False
        
    def check_interaction(self, player):
        player_rect = pygame.Rect(player.x, player.y, player.size, player.size)
        station_rect = pygame.Rect(self.x, self.y, self.size, self.size)
        return player_rect.colliderect(station_rect)
    
    def draw(self, screen, font):
        if self.station_type == "button":
            color = GREEN if self.activated else YELLOW
            pygame.draw.rect(screen, color, (self.x, self.y, self.size, self.size))
            pygame.draw.rect(screen, BLACK, (self.x, self.y, self.size, self.size), 2)
        else:  # door
            color = GREEN if self.activated else RED
            pygame.draw.rect(screen, color, (self.x, self.y, self.size, self.size))
            pygame.draw.rect(screen, BLACK, (self.x, self.y, self.size, self.size), 3)
        
        # Draw label
        label = font.render(self.station_type.upper()[0], True, BLACK)
        screen.blit(label, (self.x + self.size // 2 - 5, self.y + self.size // 2 - 10))


class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Laberinto Interactivo")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 24)
        self.title_font = pygame.font.Font(None, 36)
        
        # Game objects
        self.player = Player(50, 50)
        self.walls = self.create_maze()
        self.stations = self.create_stations()
        self.current_station = None
        self.show_question = False
        self.user_input = ""
        
    def create_maze(self):
        """Create maze walls"""
        walls = []
        
        # Outer walls
        walls.append(pygame.Rect(0, 0, SCREEN_WIDTH, 10))  # Top
        walls.append(pygame.Rect(0, 0, 10, SCREEN_HEIGHT))  # Left
        walls.append(pygame.Rect(0, SCREEN_HEIGHT - 10, SCREEN_WIDTH, 10))  # Bottom
        walls.append(pygame.Rect(SCREEN_WIDTH - 10, 0, 10, SCREEN_HEIGHT))  # Right
        
        # Inner walls
        walls.append(pygame.Rect(200, 100, 10, 300))
        walls.append(pygame.Rect(400, 200, 10, 400))
        walls.append(pygame.Rect(600, 100, 10, 300))
        walls.append(pygame.Rect(200, 400, 400, 10))
        walls.append(pygame.Rect(100, 200, 100, 10))
        walls.append(pygame.Rect(500, 100, 100, 10))
        
        return walls
    
    def create_stations(self):
        """Create interactive stations with questions"""
        stations = [
            Station(300, 150, "What is 2 + 2?", "4", "button"),
            Station(500, 250, "Capital of France?", "paris", "door"),
            Station(700, 200, "Color of the sky?", "blue", "button"),
            Station(350, 500, "Opposite of hot?", "cold", "door"),
        ]
        return stations
    
    def handle_input(self, event):
        """Handle keyboard input for answer"""
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_RETURN:
                # Check answer
                if self.current_station:
                    if self.user_input.lower().strip() == self.current_station.answer.lower():
                        self.current_station.activated = True
                        self.current_station.show_answer = True
                    self.show_question = False
                    self.user_input = ""
            elif event.key == pygame.K_BACKSPACE:
                self.user_input = self.user_input[:-1]
            elif event.key == pygame.K_ESCAPE:
                self.show_question = False
                self.user_input = ""
            else:
                self.user_input += event.unicode
    
    def run(self):
        running = True
        
        while running:
            self.clock.tick(FPS)
            
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                
                if self.show_question:
                    self.handle_input(event)
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        # Check if player is near a station
                        for station in self.stations:
                            if station.check_interaction(self.player):
                                self.current_station = station
                                self.show_question = True
                                break
            
            # Player movement (only when not answering question)
            if not self.show_question:
                keys = pygame.key.get_pressed()
                dx, dy = 0, 0
                
                if keys[pygame.K_LEFT] or keys[pygame.K_a]:
                    dx = -self.player.speed
                if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
                    dx = self.player.speed
                if keys[pygame.K_UP] or keys[pygame.K_w]:
                    dy = -self.player.speed
                if keys[pygame.K_DOWN] or keys[pygame.K_s]:
                    dy = self.player.speed
                
                self.player.move(dx, dy, self.walls)
            
            # Draw everything
            self.screen.fill(WHITE)
            
            # Draw walls
            for wall in self.walls:
                pygame.draw.rect(self.screen, GRAY, wall)
            
            # Draw stations
            for station in self.stations:
                station.draw(self.screen, self.font)
            
            # Draw player
            self.player.draw(self.screen)
            
            # Draw UI
            instructions = self.font.render("Use WASD/Arrows to move, SPACE to interact", True, BLACK)
            self.screen.blit(instructions, (20, 20))
            
            # Draw question dialog
            if self.show_question and self.current_station:
                self.draw_question_dialog()
            
            # Check win condition
            all_activated = all(station.activated for station in self.stations)
            if all_activated:
                win_text = self.title_font.render("¡FELICIDADES! All stations completed!", True, GREEN)
                self.screen.blit(win_text, (SCREEN_WIDTH // 2 - 250, SCREEN_HEIGHT // 2))
            
            pygame.display.flip()
        
        pygame.quit()
        sys.exit()
    
    def draw_question_dialog(self):
        """Draw question dialog box"""
        dialog_width = 600
        dialog_height = 300
        dialog_x = (SCREEN_WIDTH - dialog_width) // 2
        dialog_y = (SCREEN_HEIGHT - dialog_height) // 2
        
        # Draw dialog background
        pygame.draw.rect(self.screen, WHITE, (dialog_x, dialog_y, dialog_width, dialog_height))
        pygame.draw.rect(self.screen, BLACK, (dialog_x, dialog_y, dialog_width, dialog_height), 3)
        
        # Draw question
        question_text = self.title_font.render("Question:", True, BLACK)
        self.screen.blit(question_text, (dialog_x + 20, dialog_y + 20))
        
        question = self.font.render(self.current_station.question, True, BLACK)
        self.screen.blit(question, (dialog_x + 20, dialog_y + 70))
        
        # Draw input field
        input_label = self.font.render("Your answer:", True, BLACK)
        self.screen.blit(input_label, (dialog_x + 20, dialog_y + 130))
        
        input_box = pygame.Rect(dialog_x + 20, dialog_y + 160, dialog_width - 40, 40)
        pygame.draw.rect(self.screen, WHITE, input_box)
        pygame.draw.rect(self.screen, BLACK, input_box, 2)
        
        input_text = self.font.render(self.user_input, True, BLACK)
        self.screen.blit(input_text, (dialog_x + 30, dialog_y + 170))
        
        # Draw instructions
        instruction = self.font.render("Press ENTER to submit, ESC to cancel", True, GRAY)
        self.screen.blit(instruction, (dialog_x + 20, dialog_y + 220))
        
        # Show correct answer if activated
        if self.current_station.show_answer:
            answer_text = self.font.render(f"Correct! Answer: {self.current_station.answer}", True, GREEN)
            self.screen.blit(answer_text, (dialog_x + 20, dialog_y + 250))


if __name__ == "__main__":
    game = Game()
    game.run()
