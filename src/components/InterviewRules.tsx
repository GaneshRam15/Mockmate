
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Eye, 
  UserX, 
  Smartphone, 
  MonitorX, 
  Bot, 
  ArrowRight,
  ThumbsUp,
  Check
} from "lucide-react";

interface InterviewRulesProps {
  onAccept: () => void;
  onCancel: () => void;
}

const InterviewRules: React.FC<InterviewRulesProps> = ({ onAccept, onCancel }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1 text-center bg-mockmate-primary text-white rounded-t-lg">
        <CardTitle className="text-2xl">Important Interview Rules</CardTitle>
        <CardDescription className="text-white text-opacity-90">
          Please review and accept these rules before starting your interview
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <ThumbsUp className="h-5 w-5 mr-2 text-green-600" />
              Do's
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                <p className="text-sm">Answer honestly and to the best of your ability</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                <p className="text-sm">Use your own knowledge and experience</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                <p className="text-sm">Stay focused and attentive during the entire session</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                <p className="text-sm">Keep your face visible if webcam is enabled</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                <p className="text-sm">Use SHIFT+Enter for multi-line answers</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <UserX className="h-5 w-5 mr-2 text-red-600" />
              Don'ts
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MonitorX className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
                <p className="text-sm">Don't switch tabs or open other windows during the interview</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Bot className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
                <p className="text-sm">Don't use AI tools like ChatGPT to generate answers</p>
              </div>
              
              <div className="flex items-start gap-2">
                <UserX className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
                <p className="text-sm">Don't allow other people to help you with answers</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Smartphone className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
                <p className="text-sm">Don't use a second device to look up answers</p>
              </div>
              
              <div className="flex items-start gap-2">
                <Eye className="h-5 w-5 mt-0.5 text-red-600 flex-shrink-0" />
                <p className="text-sm">Don't create distractions in your environment</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 mt-0.5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">Important Note:</h4>
              <p className="text-sm text-amber-700">
                The interview will be immediately aborted if you switch tabs, open other applications, or use a split-screen. 
                Your webcam may be used to monitor your presence if you grant permission. Violation of these rules will result in
                disqualification from the interview process.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onAccept} className="gap-2">
          I Agree to These Rules
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewRules;
