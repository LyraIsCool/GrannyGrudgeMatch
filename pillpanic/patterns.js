const easy_patterns = [
    [[' ', ' ', ' ', ' ', 's'],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 's', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    ['s', ' ', 'c', ' ', ' ']],
    [[' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 's', 'p'],
    [' ', ' ', 'c', ' ', ' '],
    ['s', 'p', 'p', ' ', 'p'],
    [' ', ' ', ' ', ' ', ' ']],
    [[' ', ' ', ' ', ' ', ' '],
    ['s', ' ', 'c', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 's', ' ', ' '],
    [' ', 'p', ' ', 's', ' ']],
    [[' ', ' ', ' ', ' ', ' '],
    [' ', 's', 'c', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 's', ' ', ' '],
    ['c', 'p', ' ', 's', ' ']],
];

const medium_patterns = [
    [[' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'c', ' '],
    [' ', ' ', 'p', 's', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', 'c', 's', 'c', ' ']],
    [[' ', ' ', ' ', ' ', ' '],
    [' ', 'c', ' ', ' ', ' '],
    [' ', 's', 'p', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', 'c', 's', 'c', ' ']],
    [[' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 's', ' '],
    [' ', ' ', 'p', ' ', ' '],
    [' ', 'c', ' ', ' ', ' '],
    ['s', ' ', ' ', ' ', ' ']],
    [[' ', 'p', ' ', ' ', ' '],
    [' ', 's', ' ', ' ', ' '],
    [' ', 'p', ' ', ' ', ' '],
    [' ', 's', ' ', ' ', ' '],
    [' ', 'p', ' ', ' ', ' ']],
    [['c', ' ', ' ', ' ', 'p'],
    [' ', 'c', ' ', 'p', ' '],
    [' ', ' ', 'p', ' ', ' '],
    [' ', 'p', ' ', 'c', ' '],
    ['p', ' ', ' ', ' ', 'c']],
    [[' ', ' ', ' ', ' ', ' '],
    [' ', 'p', 's', 'p', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 'c', ' ', ' '],
    [' ', 'c', ' ', 'c', ' ']],
];

const hard_patterns = [
    [['p', 'p', 'c', 'c', 's'],
    [' ', 'c', 'c', ' ', ' '],
    ['c', 'c', 's', ' ', ' '],
    ['c', ' ', ' ', ' ', ' '],
    ['s', 'p', 'c', 'p', 'p']],
    [[' ', ' ', 'c', ' ', ' '],
    ['s', ' ', 'p', ' ', ' '],
    [' ', 's', ' ', ' ', ' '],
    [' ', ' ', 'c', 's', ' '],
    [' ', 'p', ' ', ' ', ' ']],
    [[' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 'p', 's', ' '],
    [' ', 'p', ' ', ' ', ' '],
    [' ', 's', ' ', 'p', ' '],
    [' ', 'p', 'c', ' ', ' ']],
    [[' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'p', ' '],
    [' ', ' ', ' ', 's', ' '],
    [' ', ' ', 'c', ' ', ' '],
    ['p', 's', 'p', ' ', 'p']],
    [['c', ' ', 'c', ' ', 'p'],
    [' ', 'c', 'c', 'p', ' '],
    [' ', ' ', 'p', ' ', ' '],
    [' ', 'p', 'c', 'c', ' '],
    ['p', ' ', 'c', ' ', 'c']],
    [['p', 'p', 'p', 'p', ' '],
    ['p', 'p', 'p', ' ', ' '],
    ['p', 'p', 'p', 's', 'p'],
    ['p', 'p', ' ', 'p', 'p'],
    ['p', 'p', 's', 'p', 'p']],
    [[' ', 'p', 'p', 'p', 'p'],
    [' ', ' ', 'p', 'p', 'p'],
    ['p', 's', 'p', 'p', 'p'],
    ['p', 'p', ' ', 'p', 'p'],
    ['p', 'p', 's', 'p', 'p']],
    [[' ', ' ', ' ', ' ', 's'],
    [' ', 'p', ' ', ' ', ' '],
    [' ', ' ', 'p', ' ', ' '],
    [' ', ' ', ' ', 'p', ' '],
    ['s', ' ', ' ', ' ', ' ']],
];