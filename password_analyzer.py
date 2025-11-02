import re

def analyze_password(password):
    strength_points = 0
    remarks = ""

    # Check for password length
    if len(password) >= 8:
        strength_points += 1
    else:
        remarks += "Password should be at least 8 characters long.\n"

    # Check for lowercase letters
    if re.search(r"[a-z]", password):
        strength_points += 1
    else:
        remarks += "Include lowercase letters.\n"

    # Check for uppercase letters
    if re.search(r"[A-Z]", password):
        strength_points += 1
    else:
        remarks += "Include uppercase letters.\n"

    # Check for digits
    if re.search(r"\d", password):
        strength_points += 1
    else:
        remarks += "Include numbers (0–9).\n"

    # Check for special characters
    if re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        strength_points += 1
    else:
        remarks += "Include special symbols like @, #, $, etc.\n"

    # Determine overall strength
    if strength_points <= 2:
        strength = "Weak"
        suggestion = "Try mixing uppercase, numbers, and special characters."
    elif strength_points == 3:
        strength = "Moderate"
        suggestion = "Good start! Add more variety for a stronger password."
    else:
        strength = "Strong"
        suggestion = "Excellent! Your password is strong and secure."

    print("Password:", password)
    print("Strength:", strength)
    print()
    print("Remarks / Suggestions:")
    print(remarks if remarks else "Your password meets all security checks.")
    print("Suggestion:", suggestion)


# Main program
if __name__ == "__main__":
    print("Password Strength Analyzer")
    password = input("Enter your password: ")
    analyze_password(password)
