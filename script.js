/**
 * AI Calculator - Modern & Beautiful
 * A fully functional calculator with smooth animations and clean design
 */

class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
        this.maxDigits = 15;
        
        this.currentOperandElement = document.getElementById('current-operand');
        this.previousOperandElement = document.getElementById('previous-operand');
        
        this.initialize();
    }
    
    initialize() {
        this.bindEvents();
        this.updateDisplay();
    }
    
    bindEvents() {
        // Button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.playButtonAnimation(e.target);
                const action = e.target.getAttribute('data-action');
                const value = e.target.getAttribute('data-value');
                
                switch(action) {
                    case 'number':
                        this.appendNumber(value);
                        break;
                    case 'operation':
                        this.chooseOperation(value);
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'delete':
                        this.delete();
                        break;
                    case 'calculate':
                        this.calculate();
                        break;
                }
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                this.appendNumber(e.key);
            } else if (e.key === '.') {
                this.appendNumber('.');
            } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
                this.chooseOperation(e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                this.calculate();
            } else if (e.key === 'Escape') {
                this.clear();
            } else if (e.key === 'Backspace') {
                this.delete();
            }
        });
        
        // Touch support - prevent default behavior on calculator
        document.querySelector('.calculator').addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
    }
    
    playButtonAnimation(button) {
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.8';
        
        setTimeout(() => {
            button.style.transform = '';
            button.style.opacity = '';
        }, 100);
    }
    
    appendNumber(number) {
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else if (number === '.' && this.currentOperand.includes('.')) {
            return; // Prevent multiple decimals
        } else if (this.resetScreen) {
            this.currentOperand = number;
            this.resetScreen = false;
        } else {
            // Limit digits
            if (this.currentOperand.length >= this.maxDigits && number !== '.') {
                return;
            }
            this.currentOperand += number;
        }
        
        this.updateDisplay();
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }
    
    calculate() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(result);
        this.operation = undefined;
        this.previousOperand = '';
        this.resetScreen = true;
        this.updateDisplay();
    }
    
    formatNumber(number) {
        // Handle very large or small numbers
        if (Math.abs(number) >= 1e10 || Math.abs(number) <= 1e-6) {
            return number.toExponential(6);
        }
        
        // Convert to string and handle decimal places
        const stringNumber = number.toString();
        
        // Remove trailing zeros after decimal
        if (stringNumber.includes('.')) {
            return stringNumber.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
        }
        
        return stringNumber;
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }
    
    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.innerText = this.previousOperand;
        }
    }
    
    getOperationSymbol(operation) {
        const symbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷',
            '%': '%'
        };
        return symbols[operation] || operation;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Add some visual enhancements
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Smooth hover effects for all buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transition = 'all 0.2s ease';
    });
});
