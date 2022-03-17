from gksdudaovld import KoEngMapper as Mapper
from SimpleTester import SimpleTester

tester = SimpleTester("./test_en2ko.txt", Mapper.conv_en2ko)
print(tester.start().log)