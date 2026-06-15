import httpx
import base64
import os

class OllamaClient:
    def __init__(self, base_url="http://localhost:11434", model="llama3.2-vision"):
        self.base_url = base_url
        self.model = model

    def _encode_image(self, image_path: str) -> str:
        """Encode an image file to base64 for the Ollama vision API."""
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")

    async def analyze_scene(self, image_path: str, detections: list, memory_context: list) -> str:
        # Format detections for prompt
        objects_str = ", ".join([f"{d['label']} ({d['confidence']*100:.0f}%)" for d in detections])
        
        system_prompt = (
            "Eres un asistente de análisis visual con memoria. Puedes ver la imagen directamente. "
            "Analiza lo que ves en la imagen, combinando tu comprensión visual con los resultados "
            "de detección de objetos proporcionados. Si se proporciona contexto de memoria de "
            "análisis previos, incorpóralo en tu análisis para mostrar conocimiento acumulado. "
            "IMPORTANTE: Responde SIEMPRE en castellano (español de España)."
        )
        
        user_prompt = f"Resultados de detección de objetos: {objects_str}.\n"
        
        if memory_context:
            context_str = "\n".join([f"- Para '{m['label']}': {', '.join(m['observations'])}" for m in memory_context])
            user_prompt += f"Contexto conocido de análisis previos:\n{context_str}\n"
        
        user_prompt += (
            "\nDescribe lo que ves en esta imagen con detalle. "
            "Identifica las personas, objetos, entorno y cualquier característica notable como "
            "ropa, expresiones o actividades. Sé específico y descriptivo. Responde en castellano."
        )

        # Encode the image for the vision model
        image_b64 = self._encode_image(image_path)

        payload = {
            "model": self.model,
            "system": system_prompt,
            "prompt": user_prompt,
            "images": [image_b64],
            "stream": False
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                response = await client.post(f"{self.base_url}/api/generate", json=payload)
                response.raise_for_status()
                data = response.json()
                return data.get("response", "")
            except Exception as e:
                return f"Error communicating with local LLM: {str(e)}"
