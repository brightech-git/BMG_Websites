import React, { useContext } from 'react';
import {
    Box, Image, Text, IconButton, Button, Badge, Flex,
     useDisclosure
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../context/authContext/UserAuthContext';

import { keyframes } from '@emotion/react';
// 🔁 Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const shine = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const borderSync = keyframes`
  0% { border-color: #4299e1; }
  50% { border-color: #9f7aea; }
  100% { border-color: #4299e1; }
`;

const badgeSync = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { isAuth } = useContext(useAuth);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const wishlistItems = useSelector(state => state.wishlist.wishlist || []);
    const isFavorite = wishlistItems.some(item => item._id === product._id);

    const handleWishlistToggle = (e) => {
        e.preventDefault();

        if (!isAuth) {
            onOpen();
            return;
        }

    }

    return (
        <Box
            w="100%"
            bg="white"
            position="relative"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            animation={`${float} 3s ease-in-out infinite`}
            transition="all 0.3s ease"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
        >
            <Box
                position="relative"
                bg="#fbf9f7"
                _hover={{
                    '&::after': {
                        content: `""`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                        backgroundSize: '200% 200%',
                        animation: `${shine} 2s linear infinite`,
                        zIndex: 1
                    }
                }}
            >
                <Image
                    src={product.image}
                    alt={product.title}
                    w="100%"
                    h={{ base: "180px", md: "220px", lg: "240px" }}
                    objectFit="contain"
                    p={4}
                    zIndex={0}
                />

                <IconButton
                    icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme={isFavorite ? "red" : "gray"}
                    bg="white"
                    size="sm"
                    onClick={handleWishlistToggle}
                    zIndex={2}
                    animation={`${pulse} 2s ease-in-out infinite`}
                />

                <Badge
                    position="absolute"
                    bottom={2}
                    left={2}
                    bgGradient="linear(to-r, #00b9c5, #00a5b0, #008c96)"
                    color="white"
                    fontSize="xs"
                    px={2}
                    py={0.5}
                    borderRadius="sm"
                    animation={`${badgeSync} 3s ease-in-out infinite`}
                    zIndex={2}
                >
                    {product.offer}
                </Badge>
            </Box>

            <Box p={3}>
                <Text
                    fontSize="sm"
                    fontWeight="600"
                    mb={1}
                    bgGradient="linear(to-r, blue.400, purple.500)"
                    bgClip="text"
                >
                    {product.title}
                </Text>

                <Text fontSize="xs" color="gray.600" mb={2}>
                    {product.description}
                </Text>

                <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        ₹{product.price}
                    </Text>
                    <Text fontSize="xs" color="gray.500" textDecoration="line-through">
                        ₹{product.originalPrice}
                    </Text>
                </Flex>

                <Link to={`/products/${product.id}`}>
                    <Button
                        size="sm"
                        w="full"
                        variant="outline"
                        borderColor="blue.400"
                        color="blue.500"
                        animation={`${borderSync} 2s linear infinite`}
                        _hover={{
                            bg: "blue.50",
                            transform: "scale(1.05)",
                            borderColor: "purple.500"
                        }}
                    >
                        View
                    </Button>
                </Link>
            </Box>

        
        </Box>
    );
};

export default ProductCard;
