from typing import List
try:
    from langchain_openai import ChatOpenAI
    from langchain.prompts import ChatPromptTemplate
    from langchain.schema.output_parser import StrOutputParser
except ImportError:
    ChatOpenAI = None

class PolicyRecommender:
    def __init__(self):
        try:
            self.llm = ChatOpenAI(model="gpt-4-turbo-preview", temperature=0.7)
        except Exception as e:
            print(f"Warning: Could not initialize ChatOpenAI: {e}")
            self.llm = None

    async def suggest_updates(self, policy_content: str, context: str = "") -> str:
        """
        Analyze a policy and suggest updates based on best practices and context.
        """
        if not self.llm:
            return "Error: OpenAI API Key not found. Cannot generate recommendations."

        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert in organizational governance and software engineering best practices. Analyze the provided policy and suggest improvements."),
            ("user", "Context: {context}\n\nCurrent Policy:\n{policy_content}\n\nPlease suggest specific updates to improve clarity, coverage, and enforcement.")
        ])

        chain = prompt | self.llm | StrOutputParser()
        
        try:
            return await chain.ainvoke({"policy_content": policy_content, "context": context})
        except Exception as e:
            return f"Error generating recommendations: {e}"

    async def analyze_violations(self, violations: List[str]) -> str:
        """
        Analyze a list of violations to suggest systemic policy changes.
        """
        if not self.llm:
            return "Error: OpenAI API Key not found."

        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Governance Analyst. Review the following list of compliance violations and suggest policy changes to prevent them."),
            ("user", "Violations:\n{violations}\n\nSuggest 3-5 policy updates or new standards to address these recurring issues.")
        ])

        chain = prompt | self.llm | StrOutputParser()
        
        try:
            return await chain.ainvoke({"violations": "\n".join(violations)})
        except Exception as e:
            return f"Error analyzing violations: {e}"
