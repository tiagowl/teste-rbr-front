'use client'

import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { Avatar, Button, Flex, FormControl, FormLabel, Heading, Icon, Input, InputGroup, InputLeftElement, Select, Square, Table, TableCaption, Tag, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { IoMdFunnel } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiSolidDownArrow } from "react-icons/bi";
import { HiPencilSquare } from "react-icons/hi2";
import { FaTrashAlt } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import { GiHouse } from "react-icons/gi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Employee from "@/types/employee";
import api from "@/services";
import { useParams, useSearchParams } from "next/navigation";
import { object, string } from "yup";

export default function Home() {

  const [employee, setEmployee] = useState<Partial<Employee>>({name: "", role: "", department: "", admissionDate: ""});
  const params = useParams();
  const toast = useToast();
  const router = useRouter();
  
  

  const getEmployee = async () => {
    if(params?.id){

      console.log(params);

      try{
        const response = await api.get(`/employees/${params.id}`);

        if(response.status === 200){
          setEmployee(response.data);
        }
      }catch(error){
        return toast({
          title: `${error}`,
          status: 'error',
          isClosable: true,
        });
      }

    }
  }

  const updateEmployee = async () => {

    let employeeSchema = object({
      name: string().required("Nome não pode estar vazio.").typeError("Nome não pode ser um numero"),
      role: string().required("Cargo não pode estar vazio.").typeError("Cargo não pode ser um numero"),
      department: string().required("Departamento não pode estar vazio.").typeError("Departamento não pode ser um numero")
    });

    try{
      await employeeSchema.validate(employee);
    }catch(error){

      error.errors.forEach((item)=>{
        return toast({
          title: `${item}`,
          status: 'error',
          isClosable: true,
        })
      })
      return;
    }

    try{
      const response = await api.put(`/employees/${params?.id}`, employee);

      if(response.status === 201){
        toast({
          title: 'Funcionário editado com sucesso!',
          status: 'success',
          isClosable: true,
        });
        router.push("/")
      }
    }catch(error){
      return toast({
        title: `${error}`,
        status: 'error',
        isClosable: true,
      });
    }
  }

  useEffect(()=>{
    getEmployee();
  }, [])

  return (
    <Flex w="100%" minH="100vh" maxH="auto" >
      <Flex flexDirection="column" w="256px" minH="100vh" maxH="auto" bg="gray.900" >
        <Flex h="70px" px="5" alignItems="center" borderBottom="1px solid" borderBottomColor="gray.800" >
          <Square size="30px" mr="3" borderRadius="4" bg="white" >
            <Icon as={FaCrown} color="gray.900" />
          </Square>
          <Text fontSize="sm" color="white" cursor="pointer" onClick={()=>router.push("/")} >RBR Digital</Text>
        </Flex>

        <Flex px="5" mt="5" cursor="pointer" onClick={()=>router.push("/")} >
          <Icon as={GiHouse} fontSize="xl" mr="3" color="gray.500" />
          <Text fontSize="sm" color="gray.500" >Home</Text>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection="column" >
        <Flex w="100%" px="7" alignItems="center" justifyContent="space-between" h="80px" bg="white">
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.300' />
            </InputLeftElement>
            <Input type='tel' borderRadius="3px" w="40%" bg="gray.50" border="none" fontSize="sm" placeholder='Procure um funcionário pelo nome' />
          </InputGroup>
          <Flex alignItems="center" >
            <Icon as={IoMailOutline} fontSize="2xl" mr="7" color="gray.300" />
            <Icon as={IoNotificationsOutline} fontSize="2xl" color="gray.300" />
            <Flex ml="10" w="9rem" justifyContent="space-between" alignItems="center">
              <Text color="gray.300" fontSize="sm" >RBR Digital</Text>
              <Avatar size='sm' name='RBR Digital' src="https://media.licdn.com/dms/image/C4D0BAQHY9sJuSlFm0A/company-logo_200_200/0/1633627954150?e=2147483647&v=beta&t=bZADapIRKyKmrETObgCp8VOfRAXPOM08lYrhyQPm438" />
              <Icon as={BiSolidDownArrow} color="gray.400" />
            </Flex>
          </Flex>
        </Flex> 
        <Flex w="100%" h="100%" bg="gray.50" p="32px" flexDirection="column" >
            <Heading size="md" >Editar Funcionário</Heading>

            <Flex px="2rem" flexDirection="column" py="5" w="100%" bg="white" minH="40vh" mt="3" maxH="auto" borderRadius="4px" >
                <FormControl mb="6">
                    <FormLabel>Nome</FormLabel>
                    <Input type='text' value={employee?.name} onChange={(e)=> setEmployee({...employee, name: e.target.value})} borderRadius="3px" />
                </FormControl>
                <FormControl mb="6" >
                    <FormLabel>Cargo</FormLabel>
                    <Input type='text' value={employee?.role} onChange={(e)=> setEmployee({...employee, role: e.target.value})} borderRadius="3px" />
                </FormControl>
                <FormControl mb="6" >
                    <FormLabel>Departamento</FormLabel>
                    <Input type='text' value={employee?.department} onChange={(e)=> setEmployee({...employee, department: e.target.value})} borderRadius="3px" />
                </FormControl>
                <FormControl mb="6" >
                    <FormLabel>Data de admissão</FormLabel>
                    <Input type='datetime-local' value={employee?.admissionDate} onChange={(e)=> setEmployee({...employee, admissionDate: e.target.value})} borderRadius="3px" />
                </FormControl>
                <Flex w="100%" justifyContent="flex-end" >
                    <Button bg="gray.900" color="white" onClick={()=> updateEmployee()} fontSize="sm" >Salvar</Button>
                </Flex>
            </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
