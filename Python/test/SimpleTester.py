class SimpleTester:
    """
    :param method_map - {cmd_name: method_obj}
    """
    def __init__(self, data_path, method, reverse_io=False):
        with open(data_path, encoding='UTF8')as f:
            self.dataset = f.read().split('\n')
        self.method = method
        self.reverse = reverse_io
        self.log = ""

    def set_method(self, method):
        self.method = method
        return self

    def start(self):
        self.log += "\n" * 5
        correct = 0
        wrong = 0
        for line in self.dataset:
            if line == "" or line[:2] == "//" or ">>>" not in line:
                print(line)
                continue
            i, o = '', ''
            if not self.reverse:
                i, o = map(lambda string: string.strip(), line.split(">>>"))
            else:
                o, i = map(lambda string: string.strip(), line.split(">>>"))
            try:
                result = self.method(i)
            except Exception as e:
                self.log += f"Error : ({i}) -> {type(e).__name__}\n"
                wrong += 1
                continue
            if result == o:
                self.log += f"Correct : ({i}) -> ({o})\n"
                correct += 1
            else:
                self.log += f"Wrong : ({i}) -> ({result})\n"
                wrong += 1
        self.log += f"Correct = {correct} / Wrong = {wrong}\n"
        return self