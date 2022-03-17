from gksdudaovld import KoEngMapper as Mapper
from SimpleTester import SimpleTester

# tester = SimpleTester("./test_en2ko.txt", Mapper.conv_en2ko)
# print(tester.start().log)

tester = SimpleTester("./test_ko2en.txt", Mapper.conv_ko2en)
print(tester.start().log)