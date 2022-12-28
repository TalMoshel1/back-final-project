import random

# Modify this function:
def count_rolls_until_6(n):
    res = random.choice([1, 2, 3, 4, 5, 6])
    count_rolls = 0
    n = n
    a = 0
    while a < n:
        res = random.choice([1, 2, 3, 4, 5, 6])
        print (res)
        count_rolls = count_rolls + 1
        if res = 6:
            a = a + 1
        

    return count_rolls

print (count_rolls_until_6(3))




