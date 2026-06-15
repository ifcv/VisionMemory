from ultralytics import YOLO

class YOLOv8Detector:
    def __init__(self, model_name="yolov8n.pt"):
        # This will automatically download the model on first run if not present
        self.model = YOLO(model_name)

    def detect(self, image_path: str):
        # Run inference
        results = self.model(image_path)
        
        detections = []
        # Parse results
        for r in results:
            boxes = r.boxes
            for box in boxes:
                # get coordinates
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                # get class id
                cls = int(box.cls[0])
                # get label name
                label = r.names[cls]
                # get confidence
                conf = float(box.conf[0])
                
                # convert to x, y, w, h format
                w = x2 - x1
                h = y2 - y1
                
                detections.append({
                    "label": label,
                    "confidence": round(conf, 2),
                    "bbox": [x1, y1, w, h]
                })
                
        return detections
