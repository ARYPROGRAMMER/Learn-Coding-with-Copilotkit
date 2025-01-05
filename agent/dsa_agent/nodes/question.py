from langchain.text_splitter import RecursiveCharacterTextSplitter

class QuestionRetriever:
    def __init__(self, question):
        self.question = question

    def update_question(self, question):
        self.question = question


question = "Add 2 numbers without arithmetic operators"
question_instance = QuestionRetriever(question)