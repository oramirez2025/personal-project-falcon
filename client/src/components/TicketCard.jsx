import { Box, Heading, Text } from "@chakra-ui/react";
import { MotionBox } from "./Motion";
import { Button as ChakraButton } from "@chakra-ui/react";


export default function TicketCard({ title, price, setTicketQty, description }) {
    return(
        <MotionBox 
            className="rounded-xl"
            bg="black"                 
            border="3px solid red"     
            color="white"              
            borderRadius="lg"
            boxShadow="md"
            margin="10"
            p="6"
            whileHover={{y:-4}}
            whileTap={{scale:0.98}}
            initial={{opacity:0, y:12}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.25, ease:"easeOut"}}
        >
            <Box>
                <Heading size="md" mb="2" color="gold">
                    {title}
                </Heading>

                <Text color="gold">
                    {description}
                </Text>
            </Box>

            <Box> 
                <Heading size="sm" mb="1" color="gold">
                    {price}
                </Heading>

                <input 
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    onChange={(e) => setTicketQty(e.target.value)}
                    style={{
                        background: "black",
                        color: "gold",
                        border: "1px solid red",
                        padding: "6px",
                        borderRadius: "6px"
                    }}
                />
            </Box>
        </MotionBox>
    );
}



export function Card({ title, className }) { 
    return ( <MotionBox 
        className={className} 
        bg="black" 
        border="3px solid red" 
        color="white" 
        borderRadius="lg" 
        boxShadow="md" 
        margin="10" 
        p="6" 
        textAlign="center" 
        whileHover={{ y: -4 }} 
        whileTap={{ scale: 0.98 }} 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25, ease: "easeOut" }}
     > 
        <Heading size="md" mb="2" color="gold"> 
            {title} 
        </Heading> 
        <Text color="gold">This is a styled card.</Text> 
    </MotionBox> ); }


export function Button({ children, onClick }) {
  return (
    <MotionBox
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <ChakraButton
        onClick={onClick}
        bg="black"
        color="gold"
        border="solid red"
        px="6"
        py="4"
        fontWeight="bold"
        borderRadius="lg"
        _hover={{
          bg: "red.700",
          boxShadow: "0 0 10px gold",
        }}
        _active={{
          bg: "red.800",
        }}
      >
        {children}
      </ChakraButton>
    </MotionBox>
  );
}




