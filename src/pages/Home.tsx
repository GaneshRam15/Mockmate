import { useState } from "react";
import Layout from "@/components/Layout";
import RoleSelector from "@/components/RoleSelector";
import { ResumeUpload } from "@/components/ResumeUpload";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Lightbulb, Building, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut" 
      }
    }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <Layout>
      <div className="bg-gradient-to-b from-mockmate-light to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-mockmate-secondary dark:text-white mb-6">
              Master Your Next Interview with <span className="text-mockmate-primary">MockMate</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-400 mb-8">
              Practice role-specific interview questions, get instant AI-powered feedback, and improve your interview skills.
            </p>
            <Button size="lg" onClick={() => document.getElementById('role-selector')?.scrollIntoView({ behavior: 'smooth' })}>
              Start Your Interview
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" variants={itemVariants}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Role-Specific Questions</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Practice with questions tailored to your target role, from technical to behavioral.
              </p>
            </motion.div>
            
            <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" variants={itemVariants}>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Instant Feedback</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Get real-time analysis of your answers with actionable suggestions for improvement.
              </p>
            </motion.div>
            
            <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" variants={itemVariants}>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Performance Reports</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Download detailed reports to track your progress and identify areas for improvement.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div id="role-selector">
        <RoleSelector />
      </div>
      
      {/* Why Us Section */}
      <motion.section 
        className="py-16 bg-mockmate-light dark:bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4 text-mockmate-secondary dark:text-white"
              variants={itemVariants}
            >
              <span className="text-mockmate-primary">Why</span> Us?
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              At MockMate, we believe real success starts with real preparation.
              We don't just simulate interviews — we transform your preparation into confidence.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105 duration-300"
              variants={itemVariants}
            >
              <div className="flex gap-3 mb-4">
                <div className="text-green-500">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Role-specific questions</h3>
              </div>
              <p className="text-muted-foreground dark:text-gray-400 pl-9">
                Curated by industry experts for each specific job role and position level.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105 duration-300"
              variants={itemVariants}
            >
              <div className="flex gap-3 mb-4">
                <div className="text-green-500">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Instant feedback</h3>
              </div>
              <p className="text-muted-foreground dark:text-gray-400 pl-9">
                Not just marks, but real insights into your strengths and areas for improvement.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105 duration-300"
              variants={itemVariants}
            >
              <div className="flex gap-3 mb-4">
                <div className="text-green-500">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Voice recognition practice</h3>
              </div>
              <p className="text-muted-foreground dark:text-gray-400 pl-9">
                Practice speaking your answers to sharpen your verbal communication skills.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105 duration-300"
              variants={itemVariants}
            >
              <div className="flex gap-3 mb-4">
                <div className="text-green-500">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">AI-powered analysis</h3>
              </div>
              <p className="text-muted-foreground dark:text-gray-400 pl-9">
                Deep insights into your skills, behavior patterns, and strengths.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-transform hover:scale-105 duration-300"
              variants={itemVariants}
            >
              <div className="flex gap-3 mb-4">
                <div className="text-green-500">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">Professional PDF reports</h3>
              </div>
              <p className="text-muted-foreground dark:text-gray-400 pl-9">
                Track your growth with downloadable reports after each interview session.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center mt-12 font-medium text-lg" 
            variants={itemVariants}
          >
            <p className="text-mockmate-secondary dark:text-white">
              We don't guess your skills — we decode them.<br />
              MockMate is your secret weapon to crack real-world interviews with ease.
            </p>
          </motion.div>
        </div>
      </motion.section>
      
      {/* About Us Section */}
      <motion.section 
        className="py-16 bg-white dark:bg-gray-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div 
              className="inline-block rounded-full bg-mockmate-light dark:bg-gray-800 p-3 mb-4"
              variants={itemVariants}
            >
              <Lightbulb className="h-10 w-10 text-mockmate-primary" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold mb-4 text-mockmate-secondary dark:text-white"
              variants={itemVariants}
            >
              About <span className="text-mockmate-primary">Us</span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground dark:text-gray-400 max-w-3xl mx-auto mb-8"
              variants={itemVariants}
            >
              MockMate is a next-generation AI-based interview simulator, built by passionate 
              engineers, educators, and hiring experts.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-semibold mb-4 text-mockmate-secondary dark:text-white">Our Mission</h3>
              <p className="text-muted-foreground dark:text-gray-400 mb-6">
                Help every student, fresher, and professional become interview-ready. 
                We combine Artificial Intelligence + Human Expertise to create a real, 
                challenging, and supportive interview environment.
              </p>
              
              <h3 className="text-2xl font-semibold mb-4 text-mockmate-secondary dark:text-white">Our Story</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Started as a college project, MockMate is now empowering thousands of learners 
                to land their dream jobs. And we are just getting started!
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="bg-mockmate-light dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-full">
                    <Building className="h-6 w-6 text-mockmate-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium mb-2 dark:text-white">Corporate Solutions</h4>
                    <p className="text-muted-foreground dark:text-gray-400">
                      MockMate is also used by leading companies to evaluate candidates efficiently.
                      Our platform helps HR teams streamline the interview process and identify top talent.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-full">
                    <Users className="h-6 w-6 text-mockmate-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium mb-2 dark:text-white">Join Our Community</h4>
                    <p className="text-muted-foreground dark:text-gray-400 mb-4">
                      Practice smart, and succeed with confidence! Join thousands of professionals
                      who have transformed their interview performance with MockMate.
                    </p>
                    <Button onClick={() => navigate(user ? "/dashboard" : "/login")}>
                      Get Started Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Home;
