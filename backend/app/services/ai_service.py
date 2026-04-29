import json
import json_repair
from typing import List, Optional
from anthropic import AsyncAnthropic
from app.core.config import settings
import structlog

logger = structlog.get_logger()

# Initialize the Anthropic client
client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)


class AIService:
    def __init__(self):
        self.model = settings.ANTHROPIC_MODEL

    async def _chat(self, system: str, user: str, json_mode: bool = False) -> str:
        """Helper to call Anthropic API."""
        try:
            # Anthropic handles system prompts as a separate parameter
            response = await client.messages.create(
                model=self.model,
                max_tokens=4096,
                system=system,
                messages=[
                    {"role": "user", "content": user},
                ],
                temperature=0.7,
            )
            
            content = response.content[0].text
            
            # Simple JSON extraction if the model wraps it in markdown blocks
            if json_mode:
                content = content.strip()
                if "```json" in content:
                    # Strip the markdown formatting carefully to avoid breaking inner code blocks
                    content = content.replace("```json", "", 1)
                    if content.endswith("```"):
                        content = content[:-3]
                elif "```" in content and content.startswith("```"):
                    content = content.replace("```", "", 1)
                    if content.endswith("```"):
                        content = content[:-3]
                
                # Ultimate fallback: extract between first { and last }
                start_idx = content.find("{")
                end_idx = content.rfind("}")
                if start_idx != -1 and end_idx != -1:
                    content = content[start_idx:end_idx+1]
            
            return content
        except Exception as e:
            logger.error("ai_service_error", error=str(e))
            raise

    # ─── Roadmap Generation ────────────────────────────────────────────────────
    async def generate_roadmap(self, language: str, skill_level: str, goal: Optional[str] = None, weak_areas: Optional[List[str]] = None, difficulty_adjustment: str = "same") -> dict:
        system = """You are an expert coding curriculum designer. Generate a structured, progressive learning roadmap.
        Return ONLY valid JSON matching this exact structure:
        {
          "title": "roadmap title",
          "description": "brief description",
          "nodes": [
            {
              "title": "topic title",
              "description": "what will be learned",
              "icon": "emoji",
              "xp_reward": 50,
              "estimated_minutes": 15,
              "tags": ["tag1", "tag2"]
            }
          ]
        }
        Make the roadmap progressive, starting from basics to advanced concepts for the given skill level.
        Include 10-15 nodes. Use fun emojis for icons."""

        weak_areas_text = f"\n        - User's Weak Areas (needs revision): {', '.join(weak_areas)}" if weak_areas else ""
        difficulty_text = f"\n        - Pacing / Difficulty Adjustment: {difficulty_adjustment} than average" if difficulty_adjustment != "same" else ""

        user = f"""Create a learning roadmap for:
        - Language: {language}
        - Skill Level: {skill_level}
        - Goal: {goal or 'general proficiency'}{weak_areas_text}{difficulty_text}
        
        Make it engaging, practical, and build skills progressively.
        If weak areas are provided, please integrate 1-2 specific nodes focusing on reviewing those concepts.
        If pacing/difficulty adjustment is requested, adjust the node difficulty and structure accordingly."""

        content = await self._chat(system, user, json_mode=True)
        return json_repair.loads(content)

    # ─── Lesson Generation ─────────────────────────────────────────────────────
    async def generate_lesson(self, language: str, topic: str, skill_level: str, weak_areas: Optional[List[str]] = None, difficulty_adjustment: str = "same") -> dict:
        system = """You are an expert coding teacher. Generate a complete, engaging lesson.
        Return ONLY valid JSON matching this exact structure.
        CRITICAL: You MUST properly escape all double quotes (\\") and newlines (\\\\n) inside string values, especially within the theory_content markdown blocks!
        {
          "title": "lesson title",
          "theory_content": "detailed markdown explanation with code examples using ``` code blocks ```",
          "summary": "brief 1-2 sentence summary",
          "difficulty": "easy|medium|hard",
          "estimated_minutes": 10,
          "exercises": [
            {
              "type": "mcq",
              "question": "question text",
              "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
              "correct_answer": "A) option1",
              "explanation": "why this is correct",
              "hint": "helpful hint"
            },
            {
              "type": "fill_in",
              "question": "Complete the code: print(___)",
              "correct_answer": "Hello, World!",
              "explanation": "explanation",
              "hint": "hint"
            },
            {
              "type": "code_challenge",
              "question": "Write a function that...",
              "correct_answer": "expected output",
              "starter_code": "# Write your code here\n",
              "explanation": "explanation of the solution",
              "hint": "hint",
              "test_cases": [{"input": "", "output": "expected"}]
            }
          ]
        }
        Include 3-5 varied exercises (mix of MCQ, fill-in, and code challenges).
        Theory content should be rich with examples in markdown format."""

        weak_areas_text = f"\n        - User's Historically Weak Areas: {', '.join(weak_areas)}" if weak_areas else ""
        difficulty_text = f"\n        - Current Difficulty Adjustment: {difficulty_adjustment}" if difficulty_adjustment != "same" else ""

        user = f"""Create a complete lesson for:
        - Language: {language}
        - Topic: {topic}
        - Skill Level: {skill_level}{weak_areas_text}{difficulty_text}
        
        CRITICAL DIFFICULTY INSTRUCTIONS:
        If the skill level is "beginner" or "easy" OR the difficulty adjustment is "easier", you MUST write the theory and exercises as if you are teaching a middle schooler who has NEVER coded before. Do NOT use advanced terminology, time complexity (like O(1) or O(n)), or discuss how things work "under the hood". Use simple real-world analogies (like a grocery list or a line of people). The exercises must be extremely easy, focusing only on basic syntax and simple concepts.
        Only introduce technical depth, performance considerations, and tricky edge cases if the skill level is intermediate or advanced and the adjustment is not "easier".
        If "harder" is requested, provide more challenging edge cases or performance discussions.
        If weak areas are mentioned and are relevant to this topic, specifically address common misconceptions about them.
        
        Make it educational, engaging, and perfectly tailored to the requested skill level and adjustments."""

        content = await self._chat(system, user, json_mode=True)
        try:
            return json_repair.loads(content)
        except Exception as e:
            logger.error("json_decode_error in generate_lesson", error=str(e), raw_content=content)
            # Fallback/retry could be implemented here, but for now we raise to let the client know.
            raise ValueError(f"Failed to parse AI response as JSON: {e}")

    # ─── Concept Explanation ───────────────────────────────────────────────────
    async def explain_concept(self, concept: str, language: str, skill_level: str) -> str:
        system = f"""You are an encouraging coding tutor teaching {language} to a {skill_level} learner.
        Explain concepts clearly with:
        - Simple analogies
        - Real code examples
        - Step-by-step breakdowns
        - Encouraging tone
        Keep explanations concise but thorough. Use markdown formatting."""

        user = f"Please explain: {concept}"
        return await self._chat(system, user)

    # ─── Hint Generation ──────────────────────────────────────────────────────
    async def get_hint(self, question: str, language: str, user_answer: Optional[str] = None) -> str:
        system = f"""You are a helpful coding tutor. Give a useful hint WITHOUT revealing the full answer.
        Guide the student toward the solution step by step.
        Be encouraging and supportive."""

        user = f"""Question: {question}
        {f"Student's current attempt: {user_answer}" if user_answer else ""}
        Give a helpful hint that nudges them in the right direction."""

        return await self._chat(system, user)

    # ─── Answer Feedback ──────────────────────────────────────────────────────
    async def get_feedback(self, question: str, correct_answer: str, user_answer: str, language: str) -> str:
        system = f"""You are an encouraging coding tutor reviewing a student's answer.
        Provide constructive feedback that:
        - Explains what was right/wrong
        - Shows the correct approach clearly
        - Encourages continued learning
        Use markdown with code examples where helpful."""

        user = f"""Question: {question}
        Student's answer: {user_answer}
        Correct answer: {correct_answer}
        Language: {language}
        
        Provide helpful feedback."""

        return await self._chat(system, user)

    # ─── Code Debugging ───────────────────────────────────────────────────────
    async def debug_code(self, code: str, language: str, error_message: Optional[str] = None) -> dict:
        system = """You are an expert code debugger. Analyze the code and provide:
        Return ONLY valid JSON:
        {
          "issues": ["list of issues found"],
          "explanation": "detailed explanation of what's wrong",
          "fixed_code": "corrected code",
          "tips": ["best practice tips"]
        }"""

        user = f"""Debug this {language} code:
        ```{language}
        {code}
        ```
        {f"Error message: {error_message}" if error_message else ""}"""

        content = await self._chat(system, user, json_mode=True)
        return json_repair.loads(content)

    async def verify_code_answer(self, question: str, expected: str, user_answer: str) -> bool:
        """Use AI to flexibly verify a user's code submission."""
        system = """You are a strict but fair coding teacher. Evaluate if the student's code correctly solves the question.
        The student might use different variable names, add comments, or format differently than the expected answer.
        As long as the logic is correct and it fulfills the question's requirements, consider it correct.
        Return ONLY a JSON object: {"correct": true} or {"correct": false}"""
        
        user = f"""
        Question: {question}
        Expected Answer or Output: {expected}
        
        Student's Code:
        {user_answer}
        """
        
        content = await self._chat(system, user, json_mode=True)
        try:
            result = json_repair.loads(content)
            return bool(result.get("correct", False))
        except Exception:
            # Fallback to simple string inclusion if AI parsing fails completely
            return expected.strip().lower() in user_answer.strip().lower()

    async def generate_resources_for_concept(self, concept: str, language: str) -> list[dict]:
        """Use AI to generate relevant external learning links for a concept."""
        system = f"""You are a helpful programming tutor. A student is struggling with the following concept in {language}:
        "{concept}"
        
        Your task is to find or generate 2 highly relevant external URLs that will help them:
        1. A YouTube search link or a direct educational video link.
        2. A GeeksforGeeks, W3Schools, or official documentation link.
        
        Return ONLY a JSON array of objects with 'title', 'url', and 'type' (either 'youtube' or 'article').
        Format: [{{"title": "...", "url": "...", "type": "youtube"}}, {{"title": "...", "url": "...", "type": "article"}}]"""
        
        user = f"Provide 2 resource links for: {concept}"
        
        content = await self._chat(system, user, json_mode=True)
        try:
            resources = json_repair.loads(content)
            if isinstance(resources, list):
                return resources
            return []
        except Exception as e:
            logger.error("Failed to generate resources", error=str(e))
            return []

    async def simulate_code_execution(self, code: str, language: str) -> dict:
        """Use AI to accurately simulate code execution as a fallback for Judge0."""
        system = f"""You are a strict, perfectly accurate {language} compiler/interpreter. 
        Your ONLY job is to execute the provided code and return the exact standard output (stdout) or standard error (stderr) it produces.
        Do NOT explain the code. Do NOT provide tips.
        If the code runs successfully, put the exact output in 'stdout' and leave 'error' empty.
        If the code has a syntax error or runtime error, put the exact error message in 'error' and leave 'stdout' empty.
        Return ONLY a JSON object: {{"stdout": "...", "error": "..."}}"""
        
        user = f"Execute this code:\n\n```{language}\n{code}\n```"
        
        content = await self._chat(system, user, json_mode=True)
        try:
            result = json_repair.loads(content)
            return {
                "stdout": result.get("stdout", ""),
                "error": result.get("error", "")
            }
        except Exception as e:
            logger.error("Simulation failed", error=str(e))
            return {"stdout": "", "error": "AI Simulation failed to parse output."}
    # ─── AI Tutor Chat ────────────────────────────────────────────────────────
    async def chat(self, messages: list, language: str, context: Optional[str] = None) -> str:
        system = f"""You are CodeQuest AI — an expert, encouraging coding tutor specializing in {language}.
        You help students learn to code through clear explanations, examples, and positive reinforcement.
        {f"Current lesson context: {context}" if context else ""}
        
        Guidelines:
        - Be concise but thorough
        - Use code examples with markdown formatting
        - Encourage the student
        - Break down complex topics into simple steps
        - If asked about something off-topic from coding, gently redirect"""

        # Convert OpenAI-style message list to Anthropic style if necessary
        # OpenAI: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
        # Anthropic: same, but system prompt is separate.
        
        response = await client.messages.create(
            model=self.model,
            max_tokens=1024,
            system=system,
            messages=messages,
            temperature=0.7,
        )
        return response.content[0].text

    # ─── Mascot Feedback ──────────────────────────────────────────────────────
    async def get_mascot_feedback(self, code: str, language: str, question: Optional[str] = None, solved: bool = False) -> dict:
        """Analyze code for mascot feedback."""
        system = """You are 'Codey', a friendly, slightly goofy robot mascot for a coding platform.
        Your job is to provide SHORT, PUNCHY feedback (max 2 sentences) on the user's code.
        
        If solved is True: Be extremely celebratory and encouraging.
        If solved is False:
            - If the code is mostly empty: Encourage them to start.
            - If there are obvious errors: Point them out gently.
            - If they are on the right track: Nudge them forward.
        
        Return ONLY valid JSON:
        {
          "message": "your short feedback message",
          "emotion": "happy|thinking|worried|celebrating|idle",
          "direction": "right|wrong|neutral"
        }"""
        
        user = f"""
        Language: {language}
        Question/Context: {question or 'General coding'}
        Code:
        ```{language}
        {code}
        ```
        Status: {"Solved Successfully!" if solved else "In Progress"}
        """
        
        content = await self._chat(system, user, json_mode=True)
        return json_repair.loads(content)
